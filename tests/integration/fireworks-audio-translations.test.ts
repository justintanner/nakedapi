import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks audio translations integration", () => {
  describe("schema validation", () => {
    it("should have audio translations namespace", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.audio.translations).toBeDefined();
      expect(provider.v1.audio.translations).toBeTypeOf("function");
    });
  });
});
