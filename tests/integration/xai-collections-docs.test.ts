import { describe, it, expect } from "vitest";
import { xai } from "@apicity/xai";

describe("xAI collections documents integration", () => {
  describe("schema validation", () => {
    it("should have collections documents under post.v1", () => {
      const provider = xai({ apiKey: "test-key" });
      expect(provider.post.v1.collections.documents).toBeDefined();
      expect(provider.post.v1.collections.documents).toBeTypeOf("function");
    });
  });
});
