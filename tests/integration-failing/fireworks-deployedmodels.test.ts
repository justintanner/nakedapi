import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { fireworks } from "@nakedapi/fireworks";

const ACCOUNT_ID = process.env.FIREWORKS_ACCOUNT_ID ?? "test-account";

describe("fireworks deployed models (LoRA) integration", () => {
  describe("list deployed models", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fireworks/deployedmodels-list");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list deployed models", async () => {
      const provider = fireworks({
        apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
      });
      const result = await provider.v1.accounts.deployedModels.list(
        ACCOUNT_ID,
        {
          pageSize: 5,
        }
      );
      expect(result).toHaveProperty("deployedModels");
      expect(Array.isArray(result.deployedModels)).toBe(true);
    });
  });

  describe("create deployed model", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fireworks/deployedmodels-create");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a deployed model", async () => {
      const provider = fireworks({
        apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
      });
      const created = await provider.v1.accounts.deployedModels.create(
        ACCOUNT_ID,
        {
          model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
          deployment:
            "accounts/fireworks/deployments/llama-v3p1-8b-instruct-default",
        }
      );
      expect(created).toHaveProperty("model");
    });
  });

  describe("payload validation", () => {
    it("should validate create deployed model payload", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const valid = provider.v1.accounts.deployedModels.create.validatePayload({
        model: "accounts/fireworks/models/my-lora",
        deployment: "accounts/fireworks/deployments/my-deployment",
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should reject create deployed model without model", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const result = provider.v1.accounts.deployedModels.create.validatePayload(
        {
          deployment: "accounts/fireworks/deployments/my-deployment",
        }
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("model is required");
    });

    it("should reject create deployed model without deployment", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const result = provider.v1.accounts.deployedModels.create.validatePayload(
        {
          model: "accounts/fireworks/models/my-lora",
        }
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("deployment is required");
    });

    it("should expose create deployed model schema", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(
        provider.v1.accounts.deployedModels.create.payloadSchema.path
      ).toBe("/v1/accounts/{account_id}/deployedModels");
      expect(
        provider.v1.accounts.deployedModels.create.payloadSchema.method
      ).toBe("POST");
    });

    it("should validate update deployed model payload", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const valid = provider.v1.accounts.deployedModels.update.validatePayload({
        displayName: "updated-lora",
      });
      expect(valid.valid).toBe(true);
    });

    it("should expose update deployed model schema", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(
        provider.v1.accounts.deployedModels.update.payloadSchema.method
      ).toBe("PATCH");
    });

    it("should have deployed models namespace with all methods", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.deployedModels).toBeDefined();
      expect(provider.v1.accounts.deployedModels.list).toBeTypeOf("function");
      expect(provider.v1.accounts.deployedModels.create).toBeTypeOf("function");
      expect(provider.v1.accounts.deployedModels.get).toBeTypeOf("function");
      expect(provider.v1.accounts.deployedModels.update).toBeTypeOf("function");
      expect(provider.v1.accounts.deployedModels.delete).toBeTypeOf("function");
    });
  });
});
