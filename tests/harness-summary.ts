/**
 * Generates a Markdown summary of changed HAR recordings for PR comments.
 * Used in CI via: npx tsx tests/harness-summary.ts
 * Writes harness-summary.md and sets GitHub Actions output has_changes.
 */

import fs from "node:fs";
import {
  type ChangedRecording,
  type HarEntry,
  getBaseBranch,
  getChangedRecordings,
} from "./har-data.js";

const MAX_BODY_LEN = 100;
const MAX_COMMENT_LEN = 60_000;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

function extractUrlPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function renderEntry(idx: number, entry: HarEntry): string {
  const method = entry.request.method;
  const urlPath = extractUrlPath(entry.request.url);
  const status = entry.response.status;
  const reqBody = truncate(entry.request.postData?.text ?? "", MAX_BODY_LEN);
  const resBody = truncate(entry.response.content?.text ?? "", MAX_BODY_LEN);

  const reqCell = reqBody ? `\`${reqBody}\`` : "";
  const resCell = resBody ? `\`${resBody}\`` : "";

  return `| ${idx + 1} | ${method} | ${urlPath} | ${status} | ${reqCell} | ${resCell} |`;
}

function renderRecording(recording: ChangedRecording): string {
  const badge = recording.changeType === "new" ? " (new)" : " (modified)";
  const lines: string[] = [
    `### ${recording.provider}/${recording.recordingName}${badge}`,
    "",
    "| # | Method | URL | Status | Request | Response |",
    "|---|--------|-----|--------|---------|----------|",
  ];

  for (let i = 0; i < recording.entries.length; i++) {
    lines.push(renderEntry(i, recording.entries[i]));
  }

  return lines.join("\n");
}

function generateSummary(recordings: ChangedRecording[]): string {
  const newCount = recordings.filter((r) => r.changeType === "new").length;
  const modCount = recordings.filter((r) => r.changeType === "modified").length;

  const providers = [...new Set(recordings.map((r) => r.provider))];
  const providerList = providers.map((p) => `\`${p}\``).join(", ");

  const parts: string[] = [];
  if (newCount > 0) {
    parts.push(`**${newCount} new** recording${newCount === 1 ? "" : "s"}`);
  }
  if (modCount > 0) {
    parts.push(
      `**${modCount} modified** recording${modCount === 1 ? "" : "s"}`
    );
  }

  const lines: string[] = [
    "<!-- harness-report -->",
    "## Harness Report",
    "",
    `${parts.join(", ")} for ${providerList}`,
    "",
  ];

  for (const recording of recordings) {
    lines.push(renderRecording(recording));
    lines.push("");
  }

  lines.push("---");
  lines.push("*Full interactive viewer available as workflow artifact.*");

  let md = lines.join("\n");
  if (md.length > MAX_COMMENT_LEN) {
    md = md.slice(0, MAX_COMMENT_LEN) + "\n\n*(truncated — see full artifact)*";
  }

  return md;
}

function setOutput(name: string, value: string): void {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `${name}=${value}\n`);
  }
}

const baseBranch = getBaseBranch();
const recordings = getChangedRecordings(baseBranch);

if (recordings.length === 0) {
  setOutput("has_changes", "false");
  fs.writeFileSync("harness-summary.md", "");
} else {
  setOutput("has_changes", "true");
  const md = generateSummary(recordings);
  fs.writeFileSync("harness-summary.md", md);
}
