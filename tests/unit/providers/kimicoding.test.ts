import { describe, it, expect, vi } from "vitest";
import {
  textBlock,
  imageBase64,
  imageUrl,
  kimicoding,
} from "../../../packages/provider/kimicoding/src";
import type {
  ChatRequest,
  AnthropicMessage,
  AnthropicStreamEvent,
  KimiCodingProvider,
} from "../../../packages/provider/kimicoding/src";

function createMockProvider(): KimiCodingProvider {
  const messages = Object.assign(
    vi.fn().mockResolvedValue({
      id: "msg-test",
      type: "message",
      role: "assistant",
      content: [{ type: "text", text: "Hello! How can I help you today?" }],
      model: "k2p5",
      stop_reason: "end_turn",
      usage: { input_tokens: 10, output_tokens: 8 },
    } satisfies AnthropicMessage),
    {
      stream: vi.fn().mockImplementation(async function* (_req: ChatRequest) {
        yield {
          type: "content_block_delta",
          index: 0,
          delta: { type: "text_delta", text: "Hello" },
        } satisfies AnthropicStreamEvent;
        yield {
          type: "content_block_delta",
          index: 0,
          delta: { type: "text_delta", text: " world" },
        } satisfies AnthropicStreamEvent;
        yield {
          type: "message_delta",
          delta: { stop_reason: "end_turn" },
          usage: { output_tokens: 8 },
        } satisfies AnthropicStreamEvent;
      }),
    }
  );
  return {
    coding: {
      v1: {
        messages,
      },
    },
  };
}

describe("kimicoding provider", () => {
  it("should stream chat responses", async () => {
    const provider = createMockProvider();
    const req: ChatRequest = {
      model: "k2p5",
      max_tokens: 32768,
      messages: [{ role: "user", content: "Hello!" }],
    };

    const chunks: AnthropicStreamEvent[] = [];
    for await (const chunk of provider.coding.v1.messages.stream(req)) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(3);
    expect(chunks[0].delta?.text).toBe("Hello");
    expect(chunks[1].delta?.text).toBe(" world");
    expect(chunks[2].delta?.stop_reason).toBe("end_turn");
  });

  it("should return non-streaming chat response", async () => {
    const provider = createMockProvider();
    const req: ChatRequest = {
      model: "k2p5",
      max_tokens: 32768,
      messages: [{ role: "user", content: "Hello!" }],
    };

    const response = await provider.coding.v1.messages(req);

    expect(response.content[0].text).toBe("Hello! How can I help you today?");
    expect(response.model).toBe("k2p5");
    expect(response.usage.input_tokens + response.usage.output_tokens).toBe(18);
  });

  it("should accept content block array with image in chat request", async () => {
    const provider = createMockProvider();
    const req: ChatRequest = {
      model: "k2p5",
      max_tokens: 32768,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: "abc123",
              },
            },
            { type: "text", text: "Describe this image" },
          ],
        },
      ],
    };
    const response = await provider.coding.v1.messages(req);
    expect(response.content).toBeTruthy();
  });

  it("should accept string content", async () => {
    const provider = createMockProvider();
    const req: ChatRequest = {
      model: "k2p5",
      max_tokens: 32768,
      messages: [{ role: "user", content: "Hello!" }],
    };
    const response = await provider.coding.v1.messages(req);
    expect(response.content[0].text).toBe("Hello! How can I help you today?");
  });

  it("textBlock should return a text content block", () => {
    const block = textBlock("hello");
    expect(block).toEqual({ type: "text", text: "hello" });
  });

  it("imageBase64 should return an image content block with base64 source", () => {
    const block = imageBase64("abc123", "image/png");
    expect(block).toEqual({
      type: "image",
      source: { type: "base64", media_type: "image/png", data: "abc123" },
    });
  });

  it("imageUrl should return an image content block with url source", () => {
    const block = imageUrl("https://example.com/img.png");
    expect(block).toEqual({
      type: "image",
      source: { type: "url", url: "https://example.com/img.png" },
    });
  });

  describe("payloadSchema", () => {
    const provider = kimicoding({
      apiKey: "test-key",
      fetch: vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    });

    it("coding.v1.messages.payloadSchema has method POST and path /v1/messages", () => {
      const schema = provider.coding.v1.messages.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/v1/messages");
    });

    it("coding.v1.messages.stream.payloadSchema has method POST and path /v1/messages", () => {
      const schema = provider.coding.v1.messages.stream.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/v1/messages");
    });

    it("coding.v1.messages.validatePayload accepts valid messages request", () => {
      const result = provider.coding.v1.messages.validatePayload({
        model: "k2p5",
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 1024,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("coding.v1.messages.validatePayload rejects empty object", () => {
      const result = provider.coding.v1.messages.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.join(" ")).toContain("model");
      expect(result.errors.join(" ")).toContain("messages");
      expect(result.errors.join(" ")).toContain("max_tokens");
    });

    it("coding.v1.messages.stream.validatePayload works the same as messages", () => {
      const valid = provider.coding.v1.messages.stream.validatePayload({
        model: "k2p5",
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 1024,
      });
      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);

      const invalid = provider.coding.v1.messages.stream.validatePayload({});
      expect(invalid.valid).toBe(false);
      expect(invalid.errors.length).toBeGreaterThan(0);
    });
  });
});
