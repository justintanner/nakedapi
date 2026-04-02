import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks models create integration", () => {
  describe("schema validation", () => {
    it("should have create method on models", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.models.create).toBeDefined();
      expect(provider.v1.accounts.models.create).toBeTypeOf("function");
    });
  });
});
