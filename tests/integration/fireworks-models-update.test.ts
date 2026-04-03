import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks models update integration", () => {
  describe("payload validation", () => {
    it("should have update method on models", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.models.update).toBeDefined();
      expect(provider.v1.accounts.models.update).toBeTypeOf("function");
    });

    it("should validate update model payload", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const valid = provider.v1.accounts.models.update.validatePayload({
        displayName: "Updated Model",
        description: "An updated model description",
        public: true,
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should validate update model payload with all optional fields", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const valid = provider.v1.accounts.models.update.validatePayload({
        displayName: "Full Update",
        description: "Full description",
        kind: "HF_CKPT",
        public: false,
        contextLength: 8192,
        supportsImageInput: true,
        supportsTools: true,
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should accept empty update model payload", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const valid = provider.v1.accounts.models.update.validatePayload({});
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should expose update model schema", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const schema = provider.v1.accounts.models.update.payloadSchema;
      expect(schema.method).toBe("PATCH");
      expect(schema.path).toBe("/v1/accounts/{account_id}/models/{model_id}");
      expect(schema.contentType).toBe("application/json");
    });
  });
});
