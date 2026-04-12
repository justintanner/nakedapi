import { describe, it, expect } from "vitest";

import { createSunoProvider } from "../../packages/provider/kie/src/suno";
import { SunoGenerateRequestSchema } from "../../packages/provider/kie/src/zod";

describe("KIE Suno provider", () => {
  const mockFetch = () => Promise.resolve(new Response());
  const createProvider = () =>
    createSunoProvider("https://api.kie.ai", "test-api-key", mockFetch, 30000);

  describe("namespace structure", () => {
    it("should have correct namespace structure", () => {
      const provider = createProvider();

      expect(provider.post).toBeDefined();
      expect(provider.post.api).toBeDefined();
      expect(provider.post.api.v1).toBeDefined();
      expect(provider.post.api.v1.generate).toBeDefined();
    });

    it("should have callable generate method", () => {
      const provider = createProvider();
      expect(typeof provider.post.api.v1.generate).toBe("function");
    });
  });

  describe("SunoGenerateRequestSchema", () => {
    it("should expose safeParse", () => {
      expect(typeof SunoGenerateRequestSchema.safeParse).toBe("function");
    });

    it("should expose parse", () => {
      expect(typeof SunoGenerateRequestSchema.parse).toBe("function");
    });
  });

  describe("generate payload validation", () => {
    it("should validate valid generate payload", () => {
      const payload = {
        prompt: "A happy pop song about summer",
        model: "V4",
        instrumental: false,
        customMode: true,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate minimal required payload", () => {
      const payload = {
        prompt: "A rock song",
        model: "V5",
        instrumental: true,
        customMode: false,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject payload without required prompt", () => {
      const payload = {
        model: "V4",
        instrumental: false,
        customMode: true,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("prompt"))).toBe(
        true
      );
    });

    it("should reject payload without required model", () => {
      const payload = {
        prompt: "A song",
        instrumental: false,
        customMode: true,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("model"))).toBe(
        true
      );
    });

    it("should reject payload without required instrumental", () => {
      const payload = {
        prompt: "A song",
        model: "V4",
        customMode: true,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes("instrumental"))
      ).toBe(true);
    });

    it("should reject payload without required customMode", () => {
      const payload = {
        prompt: "A song",
        model: "V4",
        instrumental: false,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes("customMode"))
      ).toBe(true);
    });

    it("should reject invalid model enum", () => {
      const payload = {
        prompt: "A song",
        model: "V6",
        instrumental: false,
        customMode: true,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("model"))).toBe(
        true
      );
    });

    it("should validate with all valid model versions", () => {
      const validModels = ["V4", "V4_5", "V4_5PLUS", "V4_5ALL", "V5"];

      for (const model of validModels) {
        const payload = {
          prompt: "A song",
          model,
          instrumental: false,
          customMode: true,
        };

        const result = SunoGenerateRequestSchema.safeParse(payload);
        expect(result.success).toBe(true);
      }
    });

    it("should validate with optional fields", () => {
      const payload = {
        prompt: "A jazz song",
        model: "V4_5",
        instrumental: true,
        customMode: true,
        style: "Jazz Fusion",
        negativeTags: "rock, pop",
        title: "My Jazz Song",
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate with only required fields", () => {
      const payload = {
        prompt: "Simple song",
        model: "V5",
        instrumental: false,
        customMode: false,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject non-boolean instrumental", () => {
      const payload = {
        prompt: "A song",
        model: "V4",
        instrumental: "yes",
        customMode: true,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes("instrumental"))
      ).toBe(true);
    });

    it("should reject non-boolean customMode", () => {
      const payload = {
        prompt: "A song",
        model: "V4",
        instrumental: false,
        customMode: "no",
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes("customMode"))
      ).toBe(true);
    });

    it("should reject non-string prompt", () => {
      const payload = {
        prompt: 123,
        model: "V4",
        instrumental: false,
        customMode: true,
      };

      const result = SunoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("prompt"))).toBe(
        true
      );
    });
  });

  describe("provider method validation", () => {
    it("generate should have schema attached", () => {
      const provider = createProvider();
      expect(provider.post.api.v1.generate.schema).toBeDefined();
      expect(typeof provider.post.api.v1.generate.schema.safeParse).toBe(
        "function"
      );
    });

    it("generate schema should validate correctly", () => {
      const provider = createProvider();
      const result = provider.post.api.v1.generate.schema.safeParse({
        prompt: "Test song",
        model: "V4",
        instrumental: true,
        customMode: false,
      });
      expect(result.success).toBe(true);
    });

    it("generate schema should reject invalid payload", () => {
      const provider = createProvider();
      const result = provider.post.api.v1.generate.schema.safeParse({
        prompt: "Test",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues.length).toBeGreaterThan(0);
    });
  });

  describe("SunoModel type validation", () => {
    it("should accept all valid SunoModel values", () => {
      const provider = createProvider();
      const validModels = ["V4", "V4_5", "V4_5PLUS", "V4_5ALL", "V5"];

      for (const model of validModels) {
        const result = provider.post.api.v1.generate.schema.safeParse({
          prompt: "Test",
          model,
          instrumental: false,
          customMode: true,
        });
        expect(result.success).toBe(true);
      }
    });
  });
});
