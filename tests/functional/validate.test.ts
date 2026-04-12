// Tests for validatePayload — pure function, no API calls
// Providers migrated to Zod (openai, kie, kimicoding, free, xai, anthropic) are tested via safeParse.
import { describe, it, expect } from "vitest";

// OpenAI validation (Zod schemas)
import {
  OpenAiChatRequestSchema,
  OpenAiEmbeddingRequestSchema,
  OpenAiResponseRequestSchema,
  OpenAiSpeechRequestSchema,
  OpenAiModerationRequestSchema,
} from "../../packages/provider/openai/src/zod";

// KimiCoding validation (Zod schemas)
import {
  ChatRequestSchema as KimiChatRequestSchema,
  EmbeddingRequestSchema as KimiEmbeddingRequestSchema,
} from "../../packages/provider/kimicoding/src/zod";

// xAI validation (Zod schemas)
import {
  XaiChatRequestSchema as xaiChatSchema,
  XaiImageGenerateRequestSchema as xaiImageSchema,
} from "../../packages/provider/xai/src/zod";

// Anthropic validation (Zod schemas)
import {
  AnthropicMessageRequestSchema,
  AnthropicCountTokensRequestSchema,
} from "../../packages/provider/anthropic/src/zod";

describe("validatePayload", () => {
  describe("OpenAI", () => {
    it("should validate valid chat completion payload", () => {
      const result = OpenAiChatRequestSchema.safeParse({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Hello" }],
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid chat completion payload", () => {
      const result = OpenAiChatRequestSchema.safeParse({
        model: "gpt-4o",
        // Missing required 'messages' field
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues.length).toBeGreaterThan(0);
    });

    it("should validate valid embeddings payload", () => {
      const result = OpenAiEmbeddingRequestSchema.safeParse({
        model: "text-embedding-3-small",
        input: "Hello world",
      });
      expect(result.success).toBe(true);
    });

    it("should validate valid responses payload", () => {
      const result = OpenAiResponseRequestSchema.safeParse({
        model: "gpt-4o",
        input: "Hello",
      });
      expect(result.success).toBe(true);
    });

    it("should validate valid audio speech payload", () => {
      const result = OpenAiSpeechRequestSchema.safeParse({
        model: "tts-1",
        input: "Hello",
        voice: "alloy",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid audio speech payload", () => {
      const result = OpenAiSpeechRequestSchema.safeParse({
        model: "tts-1",
        input: "Hello",
        // Missing required 'voice' field
      });
      expect(result.success).toBe(false);
    });

    it("should validate valid moderations payload", () => {
      const result = OpenAiModerationRequestSchema.safeParse({
        input: "Text to moderate",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("KimiCoding", () => {
    it("should validate valid messages payload", () => {
      const result = KimiChatRequestSchema.safeParse({
        model: "k2p5",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 1024,
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid messages payload", () => {
      const result = KimiChatRequestSchema.safeParse({
        model: "k2p5",
        // Missing required fields
      });
      expect(result.success).toBe(false);
    });

    it("should validate valid embeddings payload", () => {
      const result = KimiEmbeddingRequestSchema.safeParse({
        model: "k2p5",
        input: "Hello world",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("xAI", () => {
    it("should validate valid chat completion payload", () => {
      const result = xaiChatSchema.safeParse({
        model: "grok-3",
        messages: [{ role: "user", content: "Hello" }],
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid chat completion payload", () => {
      const result = xaiChatSchema.safeParse({
        model: "grok-3",
        // Missing required 'messages' field
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues.length).toBeGreaterThan(0);
    });

    it("should validate valid image generation payload", () => {
      const result = xaiImageSchema.safeParse({
        model: "grok-2-image",
        prompt: "A cat",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Anthropic", () => {
    it("should validate valid messages payload", () => {
      const result = AnthropicMessageRequestSchema.safeParse({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Hello" }],
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid messages payload", () => {
      const result = AnthropicMessageRequestSchema.safeParse({
        model: "claude-sonnet",
        // Missing required 'max_tokens'
        messages: [{ role: "user", content: "Hello" }],
      });
      expect(result.success).toBe(false);
    });

    it("should validate valid count tokens payload", () => {
      const result = AnthropicCountTokensRequestSchema.safeParse({
        model: "claude-sonnet",
        messages: [{ role: "user", content: "Hello" }],
      });
      expect(result.success).toBe(true);
    });
  });
});
