import { describe, it, expect } from "vitest";

// OpenAI validation (Zod schemas)
import {
  OpenAiChatRequestSchema,
  OpenAiEmbeddingRequestSchema,
  OpenAiResponseRequestSchema,
  OpenAiSpeechRequestSchema,
  OpenAiModerationRequestSchema,
} from "../../packages/provider/openai/src/zod";

// KimiCoding validation
import { validatePayload as validateKimiPayload } from "../../packages/provider/kimicoding/src/validate";
import {
  messagesSchema as kimiMessagesSchema,
  embeddingsSchema as kimiEmbeddingsSchema,
} from "../../packages/provider/kimicoding/src/schemas";

// xAI validation
import { validatePayload as validateXaiPayload } from "../../packages/provider/xai/src/validate";
import {
  chatCompletionsSchema as xaiChatSchema,
  imageGenerationsSchema as xaiImageSchema,
} from "../../packages/provider/xai/src/schemas";

// Anthropic validation
import { validatePayload as validateAnthropicPayload } from "../../packages/provider/anthropic/src/validate";
import {
  messagesSchema as anthropicMessagesSchema,
  countTokensSchema,
} from "../../packages/provider/anthropic/src/schemas";

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
      const result = validateKimiPayload(
        {
          model: "k2p5",
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 1024,
        },
        kimiMessagesSchema
      );
      expect(result.valid).toBe(true);
    });

    it("should reject invalid messages payload", () => {
      const result = validateKimiPayload(
        {
          model: "k2p5",
          // Missing required fields
        },
        kimiMessagesSchema
      );
      expect(result.valid).toBe(false);
    });

    it("should validate valid embeddings payload", () => {
      const result = validateKimiPayload(
        {
          model: "k2p5",
          input: "Hello world",
        },
        kimiEmbeddingsSchema
      );
      expect(result.valid).toBe(true);
    });
  });

  describe("xAI", () => {
    it("should validate valid chat completion payload", () => {
      const result = validateXaiPayload(
        {
          model: "grok-3",
          messages: [{ role: "user", content: "Hello" }],
        },
        xaiChatSchema
      );
      expect(result.valid).toBe(true);
    });

    it("should reject invalid chat completion payload", () => {
      const result = validateXaiPayload(
        {
          model: "grok-3",
          // Missing required 'messages' field
        },
        xaiChatSchema
      );
      expect(result.valid).toBe(false);
    });

    it("should validate valid image generation payload", () => {
      const result = validateXaiPayload(
        {
          model: "grok-2-image",
          prompt: "A cat",
        },
        xaiImageSchema
      );
      expect(result.valid).toBe(true);
    });
  });

  describe("Anthropic", () => {
    it("should validate valid messages payload", () => {
      const result = validateAnthropicPayload(
        {
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 1024,
          messages: [{ role: "user", content: "Hello" }],
        },
        anthropicMessagesSchema
      );
      expect(result.valid).toBe(true);
    });

    it("should reject invalid messages payload", () => {
      const result = validateAnthropicPayload(
        {
          model: "claude-sonnet",
          // Missing required 'max_tokens'
          messages: [{ role: "user", content: "Hello" }],
        },
        anthropicMessagesSchema
      );
      expect(result.valid).toBe(false);
    });

    it("should validate valid count tokens payload", () => {
      const result = validateAnthropicPayload(
        {
          model: "claude-sonnet",
          messages: [{ role: "user", content: "Hello" }],
        },
        countTokensSchema
      );
      expect(result.valid).toBe(true);
    });
  });
});
