import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai } from "@nakedapi/xai";

describe("xai files content download", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("xai/files-content-download");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should upload and download file content", async () => {
    const provider = xai({
      apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
    });

    // Upload a file first
    const content = "Hello, this is test content for download.\n";
    const blob = new Blob([content], { type: "text/plain" });
    const uploaded = await provider.v1.files.upload(
      blob,
      "download-test.txt",
      "assistants"
    );
    expect(uploaded.id).toBeTruthy();

    // Download the content
    const result = await provider.v1.files.content(uploaded.id);
    expect(result.data).toBe(content);

    // Clean up
    await provider.v1.files.delete(uploaded.id);
  });
});
