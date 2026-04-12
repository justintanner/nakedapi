import { describe, it, expect } from "vitest";

import { createVeoProvider } from "../../packages/provider/kie/src/veo";
import {
  VeoGenerateRequestSchema,
  VeoExtendRequestSchema,
} from "../../packages/provider/kie/src/zod";

describe("KIE Veo provider", () => {
  const mockFetch = () => Promise.resolve(new Response());
  const createProvider = () =>
    createVeoProvider("https://api.kie.ai", "test-api-key", mockFetch, 30000);

  describe("namespace structure", () => {
    it("should have correct namespace structure", () => {
      const provider = createProvider();

      expect(provider.post).toBeDefined();
      expect(provider.post.api).toBeDefined();
      expect(provider.post.api.v1).toBeDefined();
      expect(provider.post.api.v1.veo).toBeDefined();
      expect(provider.post.api.v1.veo.generate).toBeDefined();
      expect(provider.post.api.v1.veo.extend).toBeDefined();
    });

    it("should have callable generate method", () => {
      const provider = createProvider();
      expect(typeof provider.post.api.v1.veo.generate).toBe("function");
    });

    it("should have callable extend method", () => {
      const provider = createProvider();
      expect(typeof provider.post.api.v1.veo.extend).toBe("function");
    });
  });

  describe("VeoGenerateRequestSchema", () => {
    it("should expose safeParse", () => {
      expect(typeof VeoGenerateRequestSchema.safeParse).toBe("function");
    });

    it("should expose parse", () => {
      expect(typeof VeoGenerateRequestSchema.parse).toBe("function");
    });
  });

  describe("VeoExtendRequestSchema", () => {
    it("should expose safeParse", () => {
      expect(typeof VeoExtendRequestSchema.safeParse).toBe("function");
    });

    it("should expose parse", () => {
      expect(typeof VeoExtendRequestSchema.parse).toBe("function");
    });
  });

  describe("generate payload validation", () => {
    it("should validate valid generate payload", () => {
      const payload = {
        prompt: "A cat playing piano",
        model: "veo3",
        aspectRatio: "16:9",
      };

      const result = VeoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate minimal generate payload", () => {
      const payload = {
        prompt: "A beautiful sunset",
      };

      const result = VeoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject payload without required prompt", () => {
      const payload = {
        model: "veo3",
      };

      const result = VeoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("prompt"))).toBe(
        true
      );
    });

    it("should reject invalid model enum", () => {
      const payload = {
        prompt: "Test",
        model: "invalid_model",
      };

      const result = VeoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("model"))).toBe(
        true
      );
    });

    it("should reject invalid aspectRatio enum", () => {
      const payload = {
        prompt: "Test",
        aspectRatio: "4:3",
      };

      const result = VeoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes("aspectRatio"))
      ).toBe(true);
    });

    it("should reject invalid generationType enum", () => {
      const payload = {
        prompt: "Test",
        generationType: "INVALID_TYPE",
      };

      const result = VeoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes("generationType"))
      ).toBe(true);
    });

    it("should validate with all optional fields", () => {
      const payload = {
        prompt: "A dog running",
        model: "veo3_fast",
        aspectRatio: "9:16",
        generationType: "TEXT_2_VIDEO",
        imageUrls: ["https://example.com/image1.jpg"],
        seeds: 12345,
        watermark: "Sample",
        enableTranslation: true,
      };

      const result = VeoGenerateRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  describe("extend payload validation", () => {
    it("should validate valid extend payload", () => {
      const payload = {
        taskId: "task-123",
        prompt: "Extend the video",
      };

      const result = VeoExtendRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject payload without taskId", () => {
      const payload = {
        prompt: "Extend the video",
      };

      const result = VeoExtendRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("taskId"))).toBe(
        true
      );
    });

    it("should reject payload without prompt", () => {
      const payload = {
        taskId: "task-123",
      };

      const result = VeoExtendRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("prompt"))).toBe(
        true
      );
    });

    it("should validate with model option", () => {
      const payload = {
        taskId: "task-123",
        prompt: "Extend",
        model: "quality",
      };

      const result = VeoExtendRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid model option", () => {
      const payload = {
        taskId: "task-123",
        prompt: "Extend",
        model: "invalid",
      };

      const result = VeoExtendRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes("model"))).toBe(
        true
      );
    });
  });

  describe("provider method validation", () => {
    it("generate should have schema attached", () => {
      const provider = createProvider();
      expect(provider.post.api.v1.veo.generate.schema).toBeDefined();
      expect(typeof provider.post.api.v1.veo.generate.schema.safeParse).toBe(
        "function"
      );
    });

    it("generate schema should validate correctly", () => {
      const provider = createProvider();
      const result = provider.post.api.v1.veo.generate.schema.safeParse({
        prompt: "Test",
      });
      expect(result.success).toBe(true);
    });

    it("generate schema should reject invalid payload", () => {
      const provider = createProvider();
      const result = provider.post.api.v1.veo.generate.schema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("extend should have schema attached", () => {
      const provider = createProvider();
      expect(provider.post.api.v1.veo.extend.schema).toBeDefined();
      expect(typeof provider.post.api.v1.veo.extend.schema.safeParse).toBe(
        "function"
      );
    });

    it("extend schema should validate correctly", () => {
      const provider = createProvider();
      const result = provider.post.api.v1.veo.extend.schema.safeParse({
        taskId: "task-123",
        prompt: "Extend",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("VeoModel type", () => {
    it("should accept valid model values", () => {
      const provider = createProvider();
      const validModels = ["veo3", "veo3_fast"];

      for (const model of validModels) {
        const result = provider.post.api.v1.veo.generate.schema.safeParse({
          prompt: "Test",
          model,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("VeoGenerationType", () => {
    it("should accept valid generation types", () => {
      const provider = createProvider();
      const validTypes = [
        "TEXT_2_VIDEO",
        "REFERENCE_2_VIDEO",
        "FIRST_AND_LAST_FRAMES_2_VIDEO",
      ];

      for (const generationType of validTypes) {
        const result = provider.post.api.v1.veo.generate.schema.safeParse({
          prompt: "Test",
          generationType,
        });
        expect(result.success).toBe(true);
      }
    });
  });
});
