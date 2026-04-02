import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks models prepare integration", () => {
  describe("schema validation", () => {
    it("should have prepare method on models", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.models.prepare).toBeDefined();
      expect(provider.v1.accounts.models.prepare).toBeTypeOf("function");
    });
  });
});
