import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@nakedapi/openai";

describe("openai skills integration", () => {
  let ctx: PollyContext;

  describe("list skills", () => {
    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list skills", async () => {
      ctx = setupPolly("openai/skills-list");
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.skills.list();

      expect(result.object).toBe("list");
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.has_more).toBe("boolean");
    });

    it("should list skills with limit", async () => {
      ctx = setupPolly("openai/skills-list-limit");
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.skills.list({ limit: 2 });

      expect(result.object).toBe("list");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe("list skill versions", () => {
    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list versions of a skill", async () => {
      ctx = setupPolly("openai/skill-versions-list");
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Uses a placeholder skill ID — will be replaced with real ID during recording
      const result = await provider.v1.skills.versions.list("sk_test_id");

      expect(result.object).toBe("list");
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.has_more).toBe("boolean");
    });
  });

  describe("payload validation", () => {
    it("should expose payloadSchema on create method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.skills.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/skills");
      expect(schema.contentType).toBe("multipart/form-data");
      expect(schema.fields.files.required).toBe(true);
    });

    it("should expose payloadSchema on update method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.skills.update.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/skills/{skill_id}");
      expect(schema.fields.default_version.required).toBe(true);
    });

    it("should validate a valid update payload", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const result = provider.v1.skills.update.validatePayload({
        default_version: "2",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject update payload missing default_version", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const result = provider.v1.skills.update.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should expose payloadSchema on delete method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.skills.del.payloadSchema;
      expect(schema.method).toBe("DELETE");
      expect(schema.path).toBe("/skills/{skill_id}");
    });

    it("should expose payloadSchema on versions.create method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.skills.versions.create.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/skills/{skill_id}/versions");
      expect(schema.contentType).toBe("multipart/form-data");
      expect(schema.fields.files.required).toBe(true);
    });

    it("should expose payloadSchema on versions.del method", () => {
      const provider = openai({ apiKey: "sk-test-key" });
      const schema = provider.v1.skills.versions.del.payloadSchema;
      expect(schema.method).toBe("DELETE");
      expect(schema.path).toBe("/skills/{skill_id}/versions/{version}");
    });
  });
});
