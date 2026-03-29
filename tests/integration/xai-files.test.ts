import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai } from "@nakedapi/xai";

describe("xai files extensions", () => {
  describe("chunked upload (initialize + uploadChunks)", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/files-chunked-upload");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should initialize a chunked upload and upload a chunk", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
        managementApiKey: process.env.XAI_MANAGEMENT_API_KEY ?? "mgmt-test-key",
      });

      const initResult = await provider.v1.files.initialize({
        name: "test-document.txt",
        content_type: "text/plain",
      });

      expect(initResult.file_id).toBeTruthy();
      expect(initResult.metadata).toBeDefined();
      expect(initResult.metadata.name).toBe("test-document.txt");

      const chunk = Buffer.from("Hello, this is test content.").toString(
        "base64"
      );
      const uploadResult = await provider.v1.files.uploadChunks({
        file_id: initResult.file_id,
        chunk,
      });

      expect(uploadResult.file_id).toBeTruthy();
      expect(uploadResult.name).toBe("test-document.txt");
      expect(uploadResult.upload_status).toBe("complete");
    });
  });

  describe("update file", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/files-update");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should update file metadata", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
        managementApiKey: process.env.XAI_MANAGEMENT_API_KEY ?? "mgmt-test-key",
      });

      const updated = await provider.v1.files.update("file_abc123", {
        name: "updated-name.txt",
      });

      expect(updated.file_id).toBe("file_abc123");
      expect(updated.name).toBe("updated-name.txt");
    });
  });

  describe("content download", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/files-content");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should download file content", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.files.content("file_abc123");

      expect(result.data).toBe("Hello, file content here.");
    });
  });

  describe("payload schemas", () => {
    it("should expose initialize payloadSchema", () => {
      const provider = xai({ apiKey: "sk-test-key" });
      expect(provider.v1.files.initialize.payloadSchema).toBeDefined();
      expect(provider.v1.files.initialize.payloadSchema.method).toBe("POST");
      expect(provider.v1.files.initialize.payloadSchema.path).toBe(
        "/files:initialize"
      );
    });

    it("should expose uploadChunks payloadSchema", () => {
      const provider = xai({ apiKey: "sk-test-key" });
      expect(provider.v1.files.uploadChunks.payloadSchema).toBeDefined();
      expect(provider.v1.files.uploadChunks.payloadSchema.method).toBe("POST");
    });

    it("should expose update payloadSchema", () => {
      const provider = xai({ apiKey: "sk-test-key" });
      expect(provider.v1.files.update.payloadSchema).toBeDefined();
      expect(provider.v1.files.update.payloadSchema.method).toBe("PUT");
    });

    it("should validate initialize payload", () => {
      const provider = xai({ apiKey: "sk-test-key" });
      const valid = provider.v1.files.initialize.validatePayload({
        name: "test.txt",
        content_type: "text/plain",
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.files.initialize.validatePayload({});
      expect(invalid.valid).toBe(false);
    });

    it("should validate uploadChunks payload", () => {
      const provider = xai({ apiKey: "sk-test-key" });
      const valid = provider.v1.files.uploadChunks.validatePayload({
        file_id: "file-123",
        chunk: "dGVzdA==",
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.files.uploadChunks.validatePayload({});
      expect(invalid.valid).toBe(false);
    });
  });
});
