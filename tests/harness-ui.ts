import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const PORT = 3475;
const RECORDINGS_DIR = path.resolve(import.meta.dirname, "recordings");

interface HarEntry {
  request: {
    method: string;
    url: string;
    headers: Array<{ name: string; value: string }>;
    postData?: { text: string };
  };
  response: {
    status: number;
    statusText: string;
    headers: Array<{ name: string; value: string }>;
    content: { text?: string };
  };
}

interface Recording {
  name: string;
  path: string;
  gitStatus: "new" | "modified" | "clean";
  entries: HarEntry[];
}

function getGitStatus(filePath: string): "new" | "modified" | "clean" {
  try {
    const out = execSync(`git status --porcelain "${filePath}"`, {
      encoding: "utf-8",
    }).trim();
    if (!out) return "clean";
    if (out.startsWith("??") || out.startsWith("A ")) return "new";
    return "modified";
  } catch {
    return "new";
  }
}

function scanRecordings(): Recording[] {
  const results: Recording[] = [];
  if (!fs.existsSync(RECORDINGS_DIR)) return results;

  function walk(dir: string, prefix: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(
          path.join(dir, entry.name),
          prefix ? `${prefix}/${entry.name}` : entry.name
        );
      } else if (entry.name === "recording.har") {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(process.cwd(), fullPath);
        try {
          const har = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
          results.push({
            name: prefix,
            path: relPath,
            gitStatus: getGitStatus(relPath),
            entries: har.log?.entries ?? [],
          });
        } catch {
          // skip malformed HAR files
        }
      }
    }
  }

  walk(RECORDINGS_DIR, "");
  return results;
}

function gitAdd(filePath: string): void {
  execSync(`git add "${filePath}"`);
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Polly.js Test Harness</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #1e1e2e; color: #cdd6f4; height: 100vh; display: grid; grid-template-columns: 260px 1fr; }
  #sidebar { background: #181825; border-right: 1px solid #313244; overflow-y: auto; padding: 12px 0; }
  #sidebar h2 { padding: 8px 16px; font-size: 14px; color: #a6adc8; text-transform: uppercase; letter-spacing: 1px; }
  .rec-item { padding: 10px 16px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px; border-left: 3px solid transparent; }
  .rec-item:hover { background: #313244; }
  .rec-item.active { background: #313244; border-left-color: #89b4fa; }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot.clean { background: #a6e3a1; }
  .dot.modified { background: #f9e2af; }
  .dot.new { background: #f38ba8; }
  #main { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .pane { flex: 1; overflow: auto; padding: 16px; border-bottom: 1px solid #313244; }
  .pane-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a6adc8; margin-bottom: 8px; }
  .header-line { font-size: 13px; color: #bac2de; margin: 2px 0; }
  .header-name { color: #89b4fa; }
  .header-val { color: #cdd6f4; }
  pre.body { background: #11111b; border-radius: 6px; padding: 12px; margin-top: 8px; overflow: auto; font-size: 12px; line-height: 1.5; white-space: pre-wrap; word-break: break-all; }
  .json-key { color: #89b4fa; }
  .json-str { color: #a6e3a1; }
  .json-num { color: #fab387; }
  .json-bool { color: #cba6f7; }
  .json-null { color: #6c7086; }
  #actions { padding: 12px 16px; background: #181825; border-top: 1px solid #313244; display: flex; gap: 12px; align-items: center; }
  #actions button { padding: 8px 20px; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 600; }
  #approve-btn { background: #a6e3a1; color: #1e1e2e; }
  #approve-btn:hover { background: #94e2d5; }
  #approve-btn:disabled { opacity: .4; cursor: default; }
  #status-msg { font-size: 12px; color: #a6adc8; }
  .empty { padding: 40px; text-align: center; color: #6c7086; font-size: 14px; }
</style>
</head>
<body>
<div id="sidebar">
  <h2>Recordings</h2>
  <div id="rec-list"></div>
</div>
<div id="main">
  <div class="pane" id="req-pane"><div class="empty">Select a recording</div></div>
  <div class="pane" id="res-pane"></div>
  <div id="actions">
    <button id="approve-btn" disabled>Approve</button>
    <span id="status-msg"></span>
  </div>
</div>
<script>
let recordings = [];
let selected = null;

function syntaxHighlight(json) {
  if (typeof json !== "string") json = JSON.stringify(json, null, 2);
  return json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"([^"]+)"\\s*:/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="json-str">"$1"</span>')
    .replace(/: (\\d+\\.?\\d*)/g, ': <span class="json-num">$1</span>')
    .replace(/: (true|false)/g, ': <span class="json-bool">$1</span>')
    .replace(/: (null)/g, ': <span class="json-null">$1</span>');
}

function redactAuth(val) { return /^bearer\\s/i.test(val) ? "Bearer ***" : val; }

function renderHeaders(headers) {
  return headers.map(h =>
    '<div class="header-line"><span class="header-name">' + h.name + '</span>: <span class="header-val">' +
    (h.name.toLowerCase() === "authorization" ? redactAuth(h.value) : h.value) + '</span></div>'
  ).join("");
}

function tryParseJson(text) {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

function renderEntry(entry) {
  const req = entry.request;
  const res = entry.response;

  document.getElementById("req-pane").innerHTML =
    '<div class="pane-label">Request</div>' +
    '<div class="header-line" style="font-size:15px;font-weight:600;margin-bottom:6px">' + req.method + " " + new URL(req.url).pathname + '</div>' +
    renderHeaders(req.headers) +
    (req.postData?.text ? '<pre class="body">' + syntaxHighlight(tryParseJson(req.postData.text)) + '</pre>' : '');

  document.getElementById("res-pane").innerHTML =
    '<div class="pane-label">Response ' + res.status + ' ' + res.statusText + '</div>' +
    renderHeaders(res.headers) +
    (res.content?.text ? '<pre class="body">' + syntaxHighlight(tryParseJson(res.content.text)) + '</pre>' : '');
}

function render() {
  const list = document.getElementById("rec-list");
  list.innerHTML = recordings.map((r, i) =>
    '<div class="rec-item' + (selected === i ? ' active' : '') + '" data-idx="' + i + '">' +
    '<span class="dot ' + r.gitStatus + '"></span>' + r.name + '</div>'
  ).join("");

  list.querySelectorAll(".rec-item").forEach(el => {
    el.addEventListener("click", () => {
      selected = parseInt(el.dataset.idx);
      render();
    });
  });

  const btn = document.getElementById("approve-btn");
  if (selected !== null && recordings[selected]) {
    const rec = recordings[selected];
    renderEntry(rec.entries[0] || { request: { method: "", url: "about:blank", headers: [] }, response: { status: 0, statusText: "", headers: [], content: {} } });
    btn.disabled = rec.gitStatus === "clean";
    document.getElementById("status-msg").textContent = rec.gitStatus === "clean" ? "Already approved" : "";
  }
}

document.getElementById("approve-btn").addEventListener("click", async () => {
  if (selected === null) return;
  const rec = recordings[selected];
  document.getElementById("status-msg").textContent = "Approving...";
  const res = await fetch("/api/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: rec.path }),
  });
  if (res.ok) {
    rec.gitStatus = "clean";
    document.getElementById("status-msg").textContent = "Approved and staged";
    document.getElementById("approve-btn").disabled = true;
    render();
  } else {
    document.getElementById("status-msg").textContent = "Failed to approve";
  }
});

fetch("/api/recordings").then(r => r.json()).then(data => {
  recordings = data;
  if (recordings.length) { selected = 0; }
  render();
});
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(HTML);
    return;
  }

  if (req.method === "GET" && req.url === "/api/recordings") {
    const data = scanRecordings();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
    return;
  }

  if (req.method === "POST" && req.url === "/api/approve") {
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { path: filePath } = JSON.parse(body) as { path: string };
        if (!filePath || filePath.includes("..")) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid path" }));
          return;
        }
        gitAdd(filePath);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(err) }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Polly.js Test Harness → http://localhost:${PORT}`);
});
