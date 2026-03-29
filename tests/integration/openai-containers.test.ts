import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@nakedapi/openai";

describe("openai containers integration", () => {
  let ctx: PollyContext;

  describe("list containers", () => {
    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list containers", async () => {
      ctx = setupPolly("openai/containers-list");
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.containers.list();

      expect(result.object).toBe("list");
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.has_more).toBe("boolean");
    });

    it("should list containers with limit", async () => {
      ctx = setupPolly("openai/containers-list-limit");
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.containers.list({ limit: 2 });

      expect(result.object).toBe("list");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe("payload validation", () => {
    it("should expose payloadSchema on create method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.containers.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/containers");
      expect(schema.contentType).toBe("application/json");
      expect(schema.fields.name.required).toBe(true);
    });

    it("should validate a valid create payload", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const result = provider.v1.containers.validatePayload({
        name: "my-container",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject payload missing required name", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const result = provider.v1.containers.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should expose payloadSchema on delete method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.containers.del.payloadSchema;
      expect(schema.method).toBe("DELETE");
      expect(schema.path).toBe("/containers/{container_id}");
    });

    it("should expose payloadSchema on files.create method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.containers.files.create.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/containers/{container_id}/files");
    });

    it("should expose payloadSchema on files.del method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.containers.files.del.payloadSchema;
      expect(schema.method).toBe("DELETE");
      expect(schema.path).toBe("/containers/{container_id}/files/{file_id}");
    });
  });
});
