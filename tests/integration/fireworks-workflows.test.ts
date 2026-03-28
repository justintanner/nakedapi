import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks workflows integration", () => {
  describe("text-to-image (FLUX schnell)", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fireworks/text-to-image");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should generate an image from a text prompt", async () => {
      const provider = fireworks({
        apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
      });
      const result = await provider.v1.workflows.textToImage(
        "flux-1-schnell-fp8",
        {
          prompt: "A small red cube on a white background",
          aspect_ratio: "1:1",
          seed: 42,
        }
      );
      expect(result.base64).toBeDefined();
      expect(result.base64.length).toBeGreaterThan(0);
      expect(result.finishReason).toBe("SUCCESS");
      expect(typeof result.seed).toBe("number");
    });
  });

  describe("kontext async (FLUX Kontext Pro)", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fireworks/kontext-pro");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should submit an async image generation request and poll for result", async () => {
      const provider = fireworks({
        apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
      });

      // Submit async request
      const createResult = await provider.v1.workflows.kontext(
        "flux-kontext-pro",
        {
          prompt: "A small blue sphere on a white background",
          seed: 42,
          output_format: "png",
        }
      );
      expect(createResult.request_id).toBeTruthy();

      // Poll for result
      const pollResult = await provider.v1.workflows.getResult(
        "flux-kontext-pro",
        { id: createResult.request_id }
      );
      expect(pollResult.id).toBeTruthy();
      expect(["Pending", "Ready", "Error"].includes(pollResult.status)).toBe(
        true
      );
    });
  });

  describe("payload validation", () => {
    it("should validate textToImage payload", () => {
      const provider = fireworks({ apiKey: "test" });
      const valid = provider.v1.workflows.textToImage.validatePayload({
        prompt: "A cat",
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);

      const invalid = provider.v1.workflows.textToImage.validatePayload({});
      expect(invalid.valid).toBe(false);
      expect(invalid.errors).toContain("prompt is required");
    });

    it("should validate kontext payload", () => {
      const provider = fireworks({ apiKey: "test" });
      const valid = provider.v1.workflows.kontext.validatePayload({
        prompt: "A cat",
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.workflows.kontext.validatePayload({});
      expect(invalid.valid).toBe(false);
      expect(invalid.errors).toContain("prompt is required");
    });

    it("should validate getResult payload", () => {
      const provider = fireworks({ apiKey: "test" });
      const valid = provider.v1.workflows.getResult.validatePayload({
        id: "abc-123",
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.workflows.getResult.validatePayload({});
      expect(invalid.valid).toBe(false);
      expect(invalid.errors).toContain("id is required");
    });

    it("should expose payload schemas", () => {
      const provider = fireworks({ apiKey: "test" });
      expect(provider.v1.workflows.textToImage.payloadSchema.method).toBe(
        "POST"
      );
      expect(provider.v1.workflows.kontext.payloadSchema.method).toBe("POST");
      expect(provider.v1.workflows.getResult.payloadSchema.method).toBe("POST");
    });
  });
});
