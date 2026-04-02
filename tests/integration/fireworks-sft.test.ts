import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks supervised fine-tuning integration", () => {
  describe("schema validation", () => {
    it("should expose payloadSchema on create", () => {
      const provider = fireworks({ apiKey: "fw-test-key" });
      const schema =
        provider.v1.accounts.supervisedFineTuningJobs.create.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toContain("supervisedFineTuningJobs");
      expect(schema.fields.dataset.required).toBe(true);
      expect(schema.fields.accountId.required).toBe(true);
    });

    it("should validate a valid create payload", () => {
      const provider = fireworks({ apiKey: "fw-test-key" });
      const result =
        provider.v1.accounts.supervisedFineTuningJobs.create.validatePayload({
          accountId: "test-account",
          dataset: "accounts/test-account/datasets/my-dataset",
          baseModel: "accounts/fireworks/models/llama-v3p1-8b-instruct",
          epochs: 3,
        });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject a payload missing required fields", () => {
      const provider = fireworks({ apiKey: "fw-test-key" });
      const result =
        provider.v1.accounts.supervisedFineTuningJobs.create.validatePayload({
          epochs: 3,
        });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("accountId is required");
      expect(result.errors).toContain("dataset is required");
    });

    it("should have supervised fine-tuning namespace with all methods", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.supervisedFineTuningJobs).toBeDefined();
      expect(provider.v1.accounts.supervisedFineTuningJobs.create).toBeTypeOf(
        "function"
      );
      expect(provider.v1.accounts.supervisedFineTuningJobs.list).toBeTypeOf(
        "function"
      );
      expect(provider.v1.accounts.supervisedFineTuningJobs.get).toBeTypeOf(
        "function"
      );
      expect(provider.v1.accounts.supervisedFineTuningJobs.delete).toBeTypeOf(
        "function"
      );
      expect(provider.v1.accounts.supervisedFineTuningJobs.resume).toBeTypeOf(
        "function"
      );
    });
  });
});
