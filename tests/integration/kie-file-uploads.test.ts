import { describe, it, expect, afterEach } from "vitest";
import {
  setupPollyForFileUploads,
  teardownPolly,
  type PollyContext,
} from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie file uploads", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should upload file stream and return download URL", async () => {
    ctx = setupPollyForFileUploads("kie/file-uploads/stream");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Create a small 1x1 PNG pixel as Blob
    const base64Pixel =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFCcSAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const binaryString = atob(base64Pixel);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const file = new Blob([bytes], { type: "image/png" });

    const result = await provider.post.api.fileStreamUpload({
      file,
      filename: "test-upload.png",
    });

    expect(result.code).toBe(200);
    expect(result.data?.downloadUrl).toBeTruthy();
    expect(result.data?.downloadUrl).toMatch(/^https:\/\//);
  });

  it("should upload base64 encoded file", async () => {
    ctx = setupPollyForFileUploads("kie/file-uploads/base64");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const base64Pixel =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFCcSAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const result = await provider.post.api.fileBase64Upload({
      base64: base64Pixel,
      filename: "test-base64.png",
      mimeType: "image/png",
    });

    expect(result.code).toBe(200);
    expect(result.data?.downloadUrl).toBeTruthy();
  });

  it("should validate payload schema for file uploads", async () => {
    const provider = kie({
      apiKey: "test-key",
    });

    // Valid payload
    const validResult = provider.post.api.fileStreamUpload.validatePayload({
      file: new Blob(["test"]),
      filename: "test.txt",
    });
    expect(validResult.valid).toBe(true);

    // Invalid payload (missing required fields)
    const invalidResult = provider.post.api.fileStreamUpload.validatePayload(
      {}
    );
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors?.length).toBeGreaterThan(0);
  });
});
