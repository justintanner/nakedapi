import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks models update integration", () => {
  describe("schema validation", () => {
    it("should have update method on models", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.models.update).toBeDefined();
      expect(provider.v1.accounts.models.update).toBeTypeOf("function");
    });
  });
});
