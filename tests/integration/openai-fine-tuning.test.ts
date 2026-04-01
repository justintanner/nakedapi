import { describe, it, expect } from "vitest";
import { openai } from "@nakedapi/openai";

describe("openai fine-tuning", () => {
  describe("payload validation", () => {
    const provider = openai({ apiKey: "sk-test-key" });

    it("should expose payloadSchema on jobs create", () => {
      const schema = provider.post.v1.fine_tuning.jobs.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/fine_tuning/jobs");
      expect(schema.contentType).toBe("application/json");
      expect(schema.fields.model.required).toBe(true);
      expect(schema.fields.training_file.required).toBe(true);
    });

    it("should validate create request - valid", () => {
      const result = provider.post.v1.fine_tuning.jobs.validatePayload({
        model: "gpt-4o-mini-2024-07-18",
        training_file: "file-abc123",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate create request - missing required fields", () => {
      const result = provider.post.v1.fine_tuning.jobs.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("model is required");
      expect(result.errors).toContain("training_file is required");
    });

    it("should validate create request with optional fields", () => {
      const result = provider.post.v1.fine_tuning.jobs.validatePayload({
        model: "gpt-4o-mini-2024-07-18",
        training_file: "file-abc123",
        suffix: "my-model",
        seed: 42,
        validation_file: "file-val456",
        method: {
          type: "supervised",
        },
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should expose payloadSchema on checkpoint permissions create", () => {
      const schema =
        provider.post.v1.fine_tuning.checkpoints.permissions.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe(
        "/fine_tuning/checkpoints/{checkpoint}/permissions"
      );
      expect(schema.fields.project_ids.required).toBe(true);
    });

    it("should validate checkpoint permissions create - valid", () => {
      const result =
        provider.post.v1.fine_tuning.checkpoints.permissions.validatePayload({
          project_ids: ["proj-abc123"],
        });
      expect(result.valid).toBe(true);
    });

    it("should validate checkpoint permissions create - missing project_ids", () => {
      const result =
        provider.post.v1.fine_tuning.checkpoints.permissions.validatePayload(
          {}
        );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("project_ids is required");
    });
  });

  describe("namespace wiring", () => {
    const provider = openai({ apiKey: "sk-test-key" });

    it("should expose fine_tuning.jobs as callable with child methods", () => {
      expect(typeof provider.post.v1.fine_tuning.jobs).toBe("function");
      expect(typeof provider.get.v1.fine_tuning.jobs).toBe("function");
      expect(typeof provider.post.v1.fine_tuning.jobs.cancel).toBe("function");
      expect(typeof provider.post.v1.fine_tuning.jobs.pause).toBe("function");
      expect(typeof provider.post.v1.fine_tuning.jobs.resume).toBe("function");
      expect(typeof provider.get.v1.fine_tuning.jobs.events).toBe("function");
      expect(typeof provider.get.v1.fine_tuning.jobs.checkpoints).toBe(
        "function"
      );
    });

    it("should expose fine_tuning.checkpoints.permissions as callable with child methods", () => {
      expect(typeof provider.post.v1.fine_tuning.checkpoints.permissions).toBe(
        "function"
      );
      expect(typeof provider.get.v1.fine_tuning.checkpoints.permissions).toBe(
        "function"
      );
      expect(
        typeof provider.delete.v1.fine_tuning.checkpoints.permissions
      ).toBe("function");
    });
  });
});
