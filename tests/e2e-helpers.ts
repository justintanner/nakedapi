import fs from "node:fs";
import path from "node:path";

const RECORDINGS_DIR = path.resolve(import.meta.dirname, "recordings");
const OUTPUTS_FILE = path.resolve(import.meta.dirname, "e2e-outputs.json");

interface E2EOutputs {
  [recordingName: string]: Record<string, string>;
}

/**
 * Find the HAR file for a recording name. Polly appends hash suffixes to each
 * path segment (e.g. "xai/e2e-foo/step-1" → "xai_123/e2e-foo_456/step-1_789").
 */
function findHarFile(recordingName: string): string | null {
  const segments = recordingName.split("/");
  let dir = RECORDINGS_DIR;

  for (const segment of segments) {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir);
    const match = entries.find((e) => {
      const base = e.replace(/_\d+$/, "");
      return base === segment;
    });
    if (!match) return null;
    dir = path.join(dir, match);
  }

  const harPath = path.join(dir, "recording.har");
  return fs.existsSync(harPath) ? harPath : null;
}

/**
 * Extract a value from a HAR file by key.
 *
 * Supported keys:
 * - "image_url"  → data[0].url from last response with a data array
 * - "video_url"  → video.url from last response containing a video object
 * - "request_id" → request_id from last response containing one
 * - "task_id"    → data.taskId from last response containing one
 */
export function extractFromHar(
  recordingName: string,
  key: string
): string | null {
  const harPath = findHarFile(recordingName);
  if (!harPath) return null;

  const har = JSON.parse(fs.readFileSync(harPath, "utf-8"));
  const entries: Array<{ response: { content: { text?: string } } }> =
    har.log?.entries ?? [];

  // Walk entries in reverse so we pick up the latest relevant response
  for (let i = entries.length - 1; i >= 0; i--) {
    const text = entries[i].response?.content?.text;
    if (!text) continue;

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
    } catch {
      continue;
    }

    switch (key) {
      case "image_url": {
        const data = body.data as Array<{ url?: string }> | undefined;
        if (Array.isArray(data) && data[0]?.url) return data[0].url;
        break;
      }
      case "video_url": {
        const video = body.video as { url?: string } | undefined;
        if (video?.url) return video.url;
        break;
      }
      case "request_id": {
        if (typeof body.request_id === "string") return body.request_id;
        break;
      }
      case "task_id": {
        const data = body.data as { taskId?: string } | undefined;
        if (typeof data?.taskId === "string") return data.taskId;
        break;
      }
    }
  }

  return null;
}

/**
 * Read the output of a previous E2E step. Checks e2e-outputs.json first
 * (written by the harness "Save Output" button), then falls back to parsing
 * the HAR file directly.
 *
 * Throws if the output cannot be found — record and review the step first.
 */
export function readStepOutput(recordingName: string, key: string): string {
  // 1. Try e2e-outputs.json
  if (fs.existsSync(OUTPUTS_FILE)) {
    const outputs: E2EOutputs = JSON.parse(
      fs.readFileSync(OUTPUTS_FILE, "utf-8")
    );
    const value = outputs[recordingName]?.[key];
    if (value) return value;
  }

  // 2. Fall back to HAR extraction
  const value = extractFromHar(recordingName, key);
  if (value) return value;

  throw new Error(
    `E2E step output not found: ${recordingName} → ${key}. ` +
      "Record and review this step in the harness first."
  );
}
