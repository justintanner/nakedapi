import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@apicity/openai";

describe("openai files integration", () => {
  let ctx: PollyContext;

  describe("list files", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/files-list");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list files", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.get.v1.files();

      expect(result.object).toBe("list");
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.has_more).toBe("boolean");
    });
  });

  describe("upload and retrieve file", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/files-upload");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should upload a file", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const content = '{"prompt": "test", "completion": "hello"}\n';
      const file = new Blob([content], { type: "application/jsonl" });

      const result = await provider.post.v1.files({
        file,
        purpose: "fine-tune",
      });

      expect(result.id).toBeDefined();
      expect(result.object).toBe("file");
      expect(result.filename).toBeDefined();
      expect(result.purpose).toBe("fine-tune");
    });
  });

  describe("retrieve file", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/files-retrieve");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should retrieve file info", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Use a file ID from a previously uploaded file
      const files = await provider.get.v1.files();
      if (files.data.length === 0) return; // skip if no files

      const result = await provider.get.v1.files(files.data[0].id);

      expect(result.id).toBe(files.data[0].id);
      expect(result.object).toBe("file");
      expect(result.bytes).toBeGreaterThanOrEqual(0);
      expect(result.filename).toBeDefined();
    });
  });

  describe("validation", () => {
    it("should expose payloadSchema on upload", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.post.v1.files.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/files");
      expect(schema.contentType).toBe("multipart/form-data");
      expect(schema.fields.file).toBeDefined();
      expect(schema.fields.purpose).toBeDefined();
    });

    it("should validate upload payload - valid", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.post.v1.files.validatePayload({
        file: {},
        purpose: "fine-tune",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate upload payload - missing required fields", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.post.v1.files.validatePayload({});

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("file is required");
      expect(result.errors).toContain("purpose is required");
    });

    it("should validate upload payload - invalid purpose", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.post.v1.files.validatePayload({
        file: {},
        purpose: "invalid",
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("purpose"))).toBe(true);
    });

    it("should expose payloadSchema on del", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.delete.v1.files.payloadSchema;

      expect(schema.method).toBe("DELETE");
      expect(schema.path).toBe("/files/{file_id}");
      expect(schema.fields.file_id).toBeDefined();
    });
  });
});
