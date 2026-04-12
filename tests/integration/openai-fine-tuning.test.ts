import { describe, it, expect } from "vitest";
import { openai } from "@apicity/openai";

describe("openai fine-tuning", () => {
  describe("payload validation", () => {
    const provider = openai({ apiKey: "sk-test-key" });

    it("should expose schema on jobs create", () => {
      expect(provider.post.v1.fine_tuning.jobs.schema).toBeDefined();
      expect(typeof provider.post.v1.fine_tuning.jobs.schema.safeParse).toBe(
        "function"
      );
    });

    it("should validate create request - valid", () => {
      const result = provider.post.v1.fine_tuning.jobs.schema.safeParse({
        model: "gpt-4o-mini-2024-07-18",
        training_file: "file-abc123",
      });
      expect(result.success).toBe(true);
    });

    it("should validate create request - missing required fields", () => {
      const result = provider.post.v1.fine_tuning.jobs.schema.safeParse({});
      expect(result.success).toBe(false);
      expect(result.error?.issues.length).toBeGreaterThanOrEqual(2);
    });

    it("should validate create request with optional fields", () => {
      const result = provider.post.v1.fine_tuning.jobs.schema.safeParse({
        model: "gpt-4o-mini-2024-07-18",
        training_file: "file-abc123",
        suffix: "my-model",
        seed: 42,
        validation_file: "file-val456",
        method: {
          type: "supervised",
        },
      });
      expect(result.success).toBe(true);
    });

    it("should expose schema on checkpoint permissions create", () => {
      expect(
        provider.post.v1.fine_tuning.checkpoints.permissions.schema
      ).toBeDefined();
      expect(
        typeof provider.post.v1.fine_tuning.checkpoints.permissions.schema
          .safeParse
      ).toBe("function");
    });

    it("should validate checkpoint permissions create - valid", () => {
      const result =
        provider.post.v1.fine_tuning.checkpoints.permissions.schema.safeParse({
          project_ids: ["proj-abc123"],
        });
      expect(result.success).toBe(true);
    });

    it("should validate checkpoint permissions create - missing project_ids", () => {
      const result =
        provider.post.v1.fine_tuning.checkpoints.permissions.schema.safeParse(
          {}
        );
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes("project_ids"))
      ).toBe(true);
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
