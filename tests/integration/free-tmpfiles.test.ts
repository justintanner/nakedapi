import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, afterEach } from "vitest";
import {
  setupPollyForFileUploads,
  teardownPolly,
  type PollyContext,
} from "../harness";
import { free } from "@apicity/free";

describe("free tmpfiles upload", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should upload a file and return a URL", async () => {
    ctx = setupPollyForFileUploads("free/tmpfiles-upload");
    const provider = free();

    const content = "Hello, tmpfiles!";
    const file = new Blob([content], { type: "text/plain" });

    const result = await provider.tmpfiles.api.v1.upload({
      file,
      filename: "test.txt",
    });

    expect(result.status).toBe("success");
    expect(result.data.url).toContain("tmpfiles.org");
  });

  it("should upload an image", async () => {
    ctx = setupPollyForFileUploads("free/tmpfiles-upload-image");
    const provider = free();

    const imgPath = resolve(__dirname, "../fixtures/cat1.jpg");
    const imgBuffer = readFileSync(imgPath);
    const file = new Blob([imgBuffer], { type: "image/jpeg" });

    const result = await provider.tmpfiles.api.v1.upload({
      file,
      filename: "cat1.jpg",
    });

    expect(result.status).toBe("success");
    expect(result.data.url).toContain("tmpfiles.org");
  });

  it("should upload a video", async () => {
    ctx = setupPollyForFileUploads("free/tmpfiles-upload-video");
    const provider = free();

    const vidPath = resolve(__dirname, "../fixtures/jump.mp4");
    const vidBuffer = readFileSync(vidPath);
    const file = new Blob([vidBuffer], { type: "video/mp4" });

    const result = await provider.tmpfiles.api.v1.upload({
      file,
      filename: "jump.mp4",
    });

    expect(result.status).toBe("success");
    expect(result.data.url).toContain("tmpfiles.org");
  });

  it("should expose payloadSchema on upload", () => {
    ctx = setupPollyForFileUploads("free/tmpfiles-schema");
    const provider = free();
    const schema = provider.tmpfiles.api.v1.upload.payloadSchema;

    expect(schema.method).toBe("POST");
    expect(schema.path).toBe("/api/v1/upload");
    expect(schema.contentType).toBe("multipart/form-data");
    expect(schema.fields.file.required).toBe(true);
  });

  it("should validate payload - missing file", () => {
    ctx = setupPollyForFileUploads("free/tmpfiles-validate");
    const provider = free();
    const result = provider.tmpfiles.api.v1.upload.validatePayload({});

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("file is required");
  });
});
