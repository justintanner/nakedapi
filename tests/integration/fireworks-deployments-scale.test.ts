import { describe, it, expect } from "vitest";
import { fireworks } from "@apicity/fireworks";

describe("fireworks deployments scale integration", () => {
  describe("payload validation", () => {
    it("should have scale method on deployments", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.deployments.scale).toBeDefined();
      expect(provider.v1.accounts.deployments.scale).toBeTypeOf("function");
    });

    it("should validate scale deployment payload", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const valid = provider.v1.accounts.deployments.scale.validatePayload({
        replicaCount: 3,
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it("should reject scale without replicaCount", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const result = provider.v1.accounts.deployments.scale.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("replicaCount is required");
    });

    it("should expose scale deployment schema", () => {
      const provider = fireworks({ apiKey: "test-key" });
      const schema = provider.v1.accounts.deployments.scale.payloadSchema;
      expect(schema.method).toBe("PATCH");
      expect(schema.path).toBe(
        "/v1/accounts/{account_id}/deployments/{deployment_id}:scale"
      );
      expect(schema.contentType).toBe("application/json");
      expect(schema.fields.replicaCount.required).toBe(true);
    });
  });
});
