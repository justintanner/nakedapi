import { describe, it, expect } from "vitest";
import { fireworks } from "@apicity/fireworks";

describe("fireworks dpo fine-tuning jobs", () => {
  describe("payload validation", () => {
    it("should validate create payload with required fields", () => {
      const provider = fireworks({ apiKey: "test" });
      const valid = provider.v1.accounts.dpoJobs.create.validatePayload({
        dataset: "accounts/test/datasets/my-dpo-dataset",
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should reject create payload missing required fields", () => {
      const provider = fireworks({ apiKey: "test" });
      const invalid = provider.v1.accounts.dpoJobs.create.validatePayload({});
      expect(invalid.valid).toBe(false);
      expect(invalid.errors).toContain("dataset is required");
    });

    it("should validate create payload with training config", () => {
      const provider = fireworks({ apiKey: "test" });
      const valid = provider.v1.accounts.dpoJobs.create.validatePayload({
        dataset: "accounts/test/datasets/my-dpo-dataset",
        displayName: "My DPO Job",
        trainingConfig: {
          baseModel: "accounts/fireworks/models/llama-v3p1-8b-instruct",
          epochs: 3,
          learningRate: 1e-5,
          loraRank: 8,
        },
        lossConfig: {
          method: "DPO",
          klBeta: 0.1,
        },
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should validate create payload with cloud storage config", () => {
      const provider = fireworks({ apiKey: "test" });
      const valid = provider.v1.accounts.dpoJobs.create.validatePayload({
        dataset: "accounts/test/datasets/s3-dataset",
        awsS3Config: {
          credentialsSecret: "accounts/test/secrets/aws-creds",
        },
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should expose payload schema", () => {
      const provider = fireworks({ apiKey: "test" });
      const schema = provider.v1.accounts.dpoJobs.create.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/v1/accounts/{account_id}/dpoJobs");
      expect(schema.contentType).toBe("application/json");
      expect(schema.fields.dataset.required).toBe(true);
    });
  });

  describe("namespace structure", () => {
    it("should expose create, get, list, delete, resume, and getMetricsFileEndpoint methods", () => {
      const provider = fireworks({ apiKey: "test" });
      const dpo = provider.v1.accounts.dpoJobs;
      expect(typeof dpo.create).toBe("function");
      expect(typeof dpo.get).toBe("function");
      expect(typeof dpo.list).toBe("function");
      expect(typeof dpo.delete).toBe("function");
      expect(typeof dpo.resume).toBe("function");
      expect(typeof dpo.getMetricsFileEndpoint).toBe("function");
    });
  });
});
