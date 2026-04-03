import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai, XaiError } from "@nakedapi/xai";

describe("xAI validation error integration", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("xai/validation-errors");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should handle type mismatch in request payload - string for number field", async () => {
    const provider = xai({ apiKey: process.env.XAI_API_KEY ?? "sk-test-key" });

    // Send temperature as string instead of number
    try {
      await provider.post.v1.chat.completions({
        model: "grok-3-fast",
        messages: [{ role: "user", content: "Hello" }],
        temperature: "hot" as unknown as number, // Type mismatch
      });
      expect.fail("Should have thrown XaiError");
    } catch (error) {
      expect(error).toBeInstanceOf(XaiError);
      const xaiError = error as XaiError;
      expect(xaiError.status).toBeGreaterThanOrEqual(400);
    }
  });

  it("should handle missing required field - messages", async () => {
    const provider = xai({ apiKey: process.env.XAI_API_KEY ?? "sk-test-key" });

    try {
      await provider.post.v1.chat.completions({
        model: "grok-3-fast",
        // messages field intentionally missing
      } as unknown as Parameters<typeof provider.post.v1.chat.completions>[0]);
      expect.fail("Should have thrown XaiError");
    } catch (error) {
      expect(error).toBeInstanceOf(XaiError);
      const xaiError = error as XaiError;
      // API returns error status
      expect(xaiError.status).toBeGreaterThanOrEqual(400);
    }
  });

  it("should handle invalid enum value for message role", async () => {
    const provider = xai({ apiKey: process.env.XAI_API_KEY ?? "sk-test-key" });

    try {
      await provider.post.v1.chat.completions({
        model: "grok-3-fast",
        messages: [
          { role: "superuser" as unknown, content: "Hello" },
        ] as unknown[],
      } as unknown as Parameters<typeof provider.post.v1.chat.completions>[0]);
      expect.fail("Should have thrown XaiError");
    } catch (error) {
      expect(error).toBeInstanceOf(XaiError);
      const xaiError = error as XaiError;
      expect(xaiError.status).toBeGreaterThanOrEqual(400);
    }
  });

  it("should handle invalid message structure in array", async () => {
    const provider = xai({ apiKey: process.env.XAI_API_KEY ?? "sk-test-key" });

    // Send array with malformed message object
    try {
      await provider.post.v1.chat.completions({
        model: "grok-3-fast",
        messages: [
          { role: "user", content: "Hello" },
          { role: "assistant" }, // Missing content
        ],
      } as unknown as Parameters<typeof provider.post.v1.chat.completions>[0]);
      expect.fail("Should have thrown XaiError");
    } catch (error) {
      expect(error).toBeInstanceOf(XaiError);
      const xaiError = error as XaiError;
      expect(xaiError.status).toBeGreaterThanOrEqual(400);
    }
  });

  it("should validate responses schema with invalid temperature type", async () => {
    const provider = xai({ apiKey: process.env.XAI_API_KEY ?? "sk-test-key" });

    try {
      await provider.post.v1.responses({
        model: "grok-4-fast",
        input: "Hello",
        temperature: "hot" as unknown as number, // Invalid type
      } as unknown as Parameters<typeof provider.post.v1.responses>[0]);
      expect.fail("Should have thrown XaiError");
    } catch (error) {
      expect(error).toBeInstanceOf(XaiError);
      const xaiError = error as XaiError;
      expect(xaiError.status).toBeGreaterThanOrEqual(400);
    }
  });

  it("should validate image generations with missing prompt", async () => {
    const provider = xai({ apiKey: process.env.XAI_API_KEY ?? "sk-test-key" });

    try {
      await provider.post.v1.images.generations({
        // prompt is required but missing
        model: "grok-imagine-image",
      } as unknown as Parameters<
        typeof provider.post.v1.images.generations
      >[0]);
      expect.fail("Should have thrown XaiError");
    } catch (error) {
      expect(error).toBeInstanceOf(XaiError);
      const xaiError = error as XaiError;
      expect(xaiError.status).toBeGreaterThanOrEqual(400);
    }
  });
});
