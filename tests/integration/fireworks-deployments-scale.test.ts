import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks deployments scale integration", () => {
  describe("schema validation", () => {
    it("should have scale method on deployments", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.deployments.scale).toBeDefined();
      expect(provider.v1.accounts.deployments.scale).toBeTypeOf("function");
    });
  });
});
