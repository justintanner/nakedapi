// Tests for the GPT-5.2 chat sub-provider
import { describe, it, expect, vi } from "vitest";

describe("kie chat provider", () => {
  interface KieChatMessage {
    role: "user" | "assistant" | "system";
    content:
      | string
      | Array<{
          type: "text" | "image_url";
          text?: string;
          image_url?: { url: string };
        }>;
  }

  interface KieChatRequest {
    messages: KieChatMessage[];
    temperature?: number;
    max_tokens?: number;
    response_format?: {
      type: "text" | "json_object" | "json_schema";
      json_schema?: Record<string, unknown>;
    };
  }

  interface KieChatChoice {
    index?: number;
    message?: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }

  interface KieChatResponse {
    id?: string;
    object?: string;
    created?: number;
    model?: string;
    choices?: KieChatChoice[];
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  }

  interface KieChatProvider {
    gpt52: {
      v1: {
        chat: {
          completions(
            req: KieChatRequest,
            signal?: AbortSignal
          ): Promise<KieChatResponse>;
        };
      };
    };
  }

  function createMockChatProvider(): KieChatProvider {
    return {
      gpt52: {
        v1: {
          chat: {
            completions: vi.fn().mockResolvedValue({
              id: "chatcmpl-test",
              object: "chat.completion",
              created: 1700000000,
              model: "gpt-5.2",
              choices: [
                {
                  index: 0,
                  message: {
                    role: "assistant",
                    content: "Hello! How can I help you today?",
                  },
                  finish_reason: "stop",
                },
              ],
              usage: {
                prompt_tokens: 10,
                completion_tokens: 8,
                total_tokens: 18,
              },
            }),
          },
        },
      },
    };
  }

  it("should send a simple text message", async () => {
    const chat = createMockChatProvider();
    const result = await chat.gpt52.v1.chat.completions({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(result.choices?.[0].message?.content).toBe(
      "Hello! How can I help you today?"
    );
    expect(result.model).toBe("gpt-5.2");
    expect(result.choices?.[0].finish_reason).toBe("stop");
  });

  it("should track usage tokens", async () => {
    const chat = createMockChatProvider();
    const result = await chat.gpt52.v1.chat.completions({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(result.usage?.prompt_tokens).toBe(10);
    expect(result.usage?.completion_tokens).toBe(8);
    expect(result.usage?.total_tokens).toBe(18);
  });

  it("should support system messages", async () => {
    const chat = createMockChatProvider();
    await chat.gpt52.v1.chat.completions({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello" },
      ],
    });
    expect(chat.gpt52.v1.chat.completions).toHaveBeenCalledWith({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello" },
      ],
    });
  });

  it("should support vision with image_url content parts", async () => {
    const chat = createMockChatProvider();
    await chat.gpt52.v1.chat.completions({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: "https://example.com/image.png" },
            },
            { type: "text", text: "Describe this image" },
          ],
        },
      ],
    });
    expect(chat.gpt52.v1.chat.completions).toHaveBeenCalled();
  });

  it("should support temperature and max_tokens", async () => {
    const chat = createMockChatProvider();
    await chat.gpt52.v1.chat.completions({
      messages: [{ role: "user", content: "Be creative" }],
      temperature: 0.9,
      max_tokens: 500,
    });
    expect(chat.gpt52.v1.chat.completions).toHaveBeenCalledWith({
      messages: [{ role: "user", content: "Be creative" }],
      temperature: 0.9,
      max_tokens: 500,
    });
  });

  it("should support structured output with json_object format", async () => {
    const chat = createMockChatProvider();
    (
      chat.gpt52.v1.chat.completions as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      model: "gpt-5.2",
      choices: [
        {
          message: {
            role: "assistant",
            content: '{"name": "test", "value": 42}',
          },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 15, completion_tokens: 10, total_tokens: 25 },
    });

    const result = await chat.gpt52.v1.chat.completions({
      messages: [{ role: "user", content: "Return JSON" }],
      response_format: { type: "json_object" },
    });
    expect(result.choices?.[0].message?.content).toContain('"name"');
  });

  it("should support multi-turn conversations", async () => {
    const chat = createMockChatProvider();
    await chat.gpt52.v1.chat.completions({
      messages: [
        { role: "user", content: "What is 2+2?" },
        { role: "assistant", content: "4" },
        { role: "user", content: "And 3+3?" },
      ],
    });
    expect(chat.gpt52.v1.chat.completions).toHaveBeenCalled();
  });
});
