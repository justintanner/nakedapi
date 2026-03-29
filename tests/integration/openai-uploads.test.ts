import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@nakedapi/openai";

describe("openai uploads integration", () => {
  let ctx: PollyContext;

  describe("create upload", () => {
    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create an upload session", async () => {
      ctx = setupPolly("openai/uploads-create");
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.uploads({
        filename: "test-data.jsonl",
        purpose: "fine-tune",
        bytes: 1024,
        mime_type: "application/jsonl",
      });

      expect(result.object).toBe("upload");
      expect(result.id).toBeDefined();
      expect(result.filename).toBe("test-data.jsonl");
      expect(result.purpose).toBe("fine-tune");
      expect(result.bytes).toBe(1024);
      expect(result.status).toBe("pending");
      expect(typeof result.created_at).toBe("number");
      expect(typeof result.expires_at).toBe("number");
    });
  });

  describe("payload validation", () => {
    it("should expose payloadSchema on create method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.uploads.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/uploads");
      expect(schema.contentType).toBe("application/json");
      expect(schema.fields.filename.required).toBe(true);
      expect(schema.fields.purpose.required).toBe(true);
      expect(schema.fields.bytes.required).toBe(true);
      expect(schema.fields.mime_type.required).toBe(true);
    });

    it("should validate a valid create payload", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const result = provider.v1.uploads.validatePayload({
        filename: "test.jsonl",
        purpose: "fine-tune",
        bytes: 1024,
        mime_type: "application/jsonl",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject payload missing required fields", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const result = provider.v1.uploads.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should expose payloadSchema on addPart method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.uploads.addPart.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/uploads/{upload_id}/parts");
      expect(schema.contentType).toBe("multipart/form-data");
      expect(schema.fields.data.required).toBe(true);
    });

    it("should expose payloadSchema on complete method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.uploads.complete.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/uploads/{upload_id}/complete");
      expect(schema.fields.part_ids.required).toBe(true);
    });

    it("should validate a valid complete payload", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const result = provider.v1.uploads.complete.validatePayload({
        part_ids: ["part_abc", "part_def"],
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should expose payloadSchema on cancel method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.uploads.cancel.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/uploads/{upload_id}/cancel");
    });
  });
});
