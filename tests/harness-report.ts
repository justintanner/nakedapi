/**
 * Generates a GitHub-flavored markdown report of changed HAR recordings.
 * Used in CI via: npx tsx tests/harness-report.ts >> $GITHUB_STEP_SUMMARY
 * Works locally too: npx tsx tests/harness-report.ts
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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

interface ChangedRecording {
  filePath: string;
  changeType: "new" | "modified";
  provider: string;
  recordingName: string;
  entries: HarEntry[];
}

function getBaseBranch(): string {
  const base = process.env.GITHUB_BASE_REF;
  return base ? `origin/${base}` : "origin/main";
}

function getChangedRecordings(baseBranch: string): ChangedRecording[] {
  let diff: string;
  try {
    diff = execSync(
      `git diff --name-status --diff-filter=ACMR ${baseBranch}...HEAD -- tests/recordings/`,
      { encoding: "utf-8" }
    ).trim();
  } catch {
    return [];
  }

  if (!diff) return [];

  const recordings: ChangedRecording[] = [];

  for (const line of diff.split("\n")) {
    const [status, filePath] = line.split("\t");
    if (!filePath || !filePath.endsWith("recording.har")) continue;

    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) continue;

    let har: { log?: { _recordingName?: string; entries?: HarEntry[] } };
    try {
      har = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    } catch {
      continue;
    }

    const provider = extractProvider(filePath);
    const recordingName =
      har.log?._recordingName ?? path.basename(path.dirname(filePath));

    recordings.push({
      filePath,
      changeType: status === "A" ? "new" : "modified",
      provider,
      recordingName,
      entries: har.log?.entries ?? [],
    });
  }

  return recordings;
}

function extractProvider(filePath: string): string {
  // Path: tests/recordings/xai_3613880225/chat-hello_1014512442/recording.har
  const parts = filePath.split("/");
  const recordingsIdx = parts.indexOf("recordings");
  if (recordingsIdx < 0 || recordingsIdx + 1 >= parts.length) return "unknown";
  const providerDir = parts[recordingsIdx + 1];
  // Strip hash suffix: "xai_3613880225" → "xai"
  return providerDir.replace(/_\d+$/, "");
}

function truncateLongStrings(obj: unknown, maxStringLen: number): unknown {
  if (typeof obj === "string") {
    if (obj.length > maxStringLen) {
      return `[truncated: ${obj.length} chars]`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => truncateLongStrings(item, maxStringLen));
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = truncateLongStrings(value, maxStringLen);
    }
    return result;
  }
  return obj;
}

function formatBody(raw: string | undefined, maxLen: number): string {
  if (!raw) return "_empty_";

  try {
    const parsed = JSON.parse(raw);
    const truncated = truncateLongStrings(parsed, 1000);
    const formatted = JSON.stringify(truncated, null, 2);
    if (formatted.length > maxLen) {
      return formatted.slice(0, maxLen) + "\n...";
    }
    return formatted;
  } catch {
    if (raw.length > maxLen) {
      return raw.slice(0, maxLen) + "\n...";
    }
    return raw;
  }
}

function getUrlPath(fullUrl: string): string {
  try {
    const url = new URL(fullUrl);
    return url.pathname;
  } catch {
    return fullUrl;
  }
}

function renderMarkdown(recordings: ChangedRecording[]): string {
  const newCount = recordings.filter((r) => r.changeType === "new").length;
  const modifiedCount = recordings.filter(
    (r) => r.changeType === "modified"
  ).length;

  const lines: string[] = [];
  lines.push("## Harness Report");
  lines.push("");
  lines.push(
    `**${recordings.length} recording(s) changed** (${newCount} new, ${modifiedCount} modified)`
  );
  lines.push("");
  lines.push("| Provider | Recording | Status | Transactions |");
  lines.push("|----------|-----------|--------|--------------|");

  for (const rec of recordings) {
    const name = rec.recordingName.includes("/")
      ? rec.recordingName.split("/").slice(1).join("/")
      : rec.recordingName;
    const badge = rec.changeType === "new" ? "new" : "modified";
    lines.push(
      `| ${rec.provider} | ${name} | ${badge} | ${rec.entries.length} |`
    );
  }

  // Group by provider
  const byProvider = new Map<string, ChangedRecording[]>();
  for (const rec of recordings) {
    const existing = byProvider.get(rec.provider) ?? [];
    existing.push(rec);
    byProvider.set(rec.provider, existing);
  }

  for (const [provider, recs] of byProvider) {
    lines.push("");
    lines.push("---");
    lines.push(`### ${provider}`);

    for (const rec of recs) {
      const name = rec.recordingName.includes("/")
        ? rec.recordingName.split("/").slice(1).join("/")
        : rec.recordingName;

      lines.push("");
      lines.push(`<details>`);
      lines.push(
        `<summary>${name} (${rec.changeType}) — ${rec.entries.length} transaction(s)</summary>`
      );
      lines.push("");

      for (let i = 0; i < rec.entries.length; i++) {
        const entry = rec.entries[i];
        const urlPath = getUrlPath(entry.request.url);

        lines.push(`#### ${entry.request.method} ${urlPath}`);
        lines.push("");
        lines.push("**Request**");
        lines.push("```json");
        lines.push(formatBody(entry.request.postData?.text, 500));
        lines.push("```");
        lines.push("");
        lines.push(`**Response** \`${entry.response.status}\``);
        lines.push("```json");
        lines.push(formatBody(entry.response.content?.text, 500));
        lines.push("```");
        lines.push("");
      }

      lines.push("</details>");
    }
  }

  return lines.join("\n");
}

const baseBranch = getBaseBranch();
const recordings = getChangedRecordings(baseBranch);

if (recordings.length === 0) {
  console.log("## Harness Report\n\nNo recording changes in this PR.");
} else {
  console.log(renderMarkdown(recordings));
}
