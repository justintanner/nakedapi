import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks models upload endpoint integration", () => {
  describe("schema validation", () => {
    it("should have upload endpoint methods on models", () => {
      const provider = fireworks({ apiKey: "test-key" });
      expect(provider.v1.accounts.models.getUploadEndpoint).toBeDefined();
      expect(provider.v1.accounts.models.getUploadEndpoint).toBeTypeOf(
        "function"
      );
      expect(provider.v1.accounts.models.getDownloadEndpoint).toBeDefined();
      expect(provider.v1.accounts.models.getDownloadEndpoint).toBeTypeOf(
        "function"
      );
      expect(provider.v1.accounts.models.validateUpload).toBeDefined();
      expect(provider.v1.accounts.models.validateUpload).toBeTypeOf("function");
    });
  });
});
