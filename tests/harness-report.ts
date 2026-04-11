/**
 * Generates a self-contained HTML report of changed HAR recordings.
 * Used in CI via: npx tsx tests/harness-report.ts > harness-report.html
 * Works locally too: npx tsx tests/harness-report.ts
 */

import fs from "node:fs";
import path from "node:path";
import {
  type HarRecording,
  type ChangedRecording,
  getBaseBranch,
  getChangedRecordings,
  recordingHasMedia,
} from "./har-data.js";

function generateHtml(changed: ChangedRecording[]): string {
  const viewerHtml = fs.readFileSync(
    path.resolve(import.meta.dirname, "har-viewer.html"),
    "utf-8"
  );

  const harRecordings: HarRecording[] = changed.map((r) => ({
    name: `${r.provider}/${r.recordingName}`,
    source: r.filePath,
    entries: r.entries,
  }));

  const data = {
    recordings: harRecordings,
    features: { gitApprove: false },
  };

  const dataScript = `<script>var HAR_DATA = ${JSON.stringify(data)};</script>`;
  return viewerHtml.replace("</head>", dataScript + "\n</head>");
}

function generateEmptyHtml(mediaOnly: boolean): string {
  const message = mediaOnly
    ? "No media-bearing recording changes in this PR."
    : "No recording changes in this PR.";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Harness Report</title>
<style>body{font-family:system-ui;background:#1e1e2e;color:#cdd6f4;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
p{font-size:16px;color:#6c7086}</style></head>
<body><p>${message}</p></body></html>`;
}

const mediaOnly = process.argv.includes("--media-only");
const baseBranch = getBaseBranch();
let recordings = getChangedRecordings(baseBranch);
if (mediaOnly) {
  recordings = recordings.filter(recordingHasMedia);
}

if (recordings.length === 0) {
  console.log(generateEmptyHtml(mediaOnly));
} else {
  console.log(generateHtml(recordings));
}
