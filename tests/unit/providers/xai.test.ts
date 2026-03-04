// Tests for the xai provider
import { describe, it, expect, vi } from "vitest";

describe("xai provider", () => {
  interface XaiMessage {
    role: "user" | "assistant" | "system";
    content: string;
  }

  interface XaiToolCall {
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }

  interface XaiChatResponse {
    content: string;
    model: string;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    finishReason: string;
    toolCalls?: XaiToolCall[];
  }

  interface XaiChatRequest {
    model?: string;
    messages: XaiMessage[];
    temperature?: number;
    max_tokens?: number;
    tools?: Array<{
      type: "function";
      function: {
        name: string;
        description?: string;
        parameters?: Record<string, unknown>;
      };
    }>;
    tool_choice?:
      | "auto"
      | "none"
      | { type: "function"; function: { name: string } };
  }

  interface XaiProvider {
    chat(req: XaiChatRequest, signal?: AbortSignal): Promise<XaiChatResponse>;
    search(query: string, signal?: AbortSignal): Promise<XaiChatResponse>;
  }

  function createMockProvider(): XaiProvider {
    return {
      chat: vi.fn().mockResolvedValue({
        content: "I'm Grok, nice to meet you!",
        model: "grok-4-fast",
        usage: {
          promptTokens: 12,
          completionTokens: 8,
          totalTokens: 20,
        },
        finishReason: "stop",
      }),
      search: vi.fn().mockResolvedValue({
        content: '{"urls": ["https://x.com/user/status/123"]}',
        model: "grok-4-fast",
        usage: {
          promptTokens: 50,
          completionTokens: 30,
          totalTokens: 80,
        },
        finishReason: "stop",
      }),
    };
  }

  it("should send a chat message", async () => {
    const provider = createMockProvider();
    const result = await provider.chat({
      messages: [{ role: "user", content: "Hello Grok!" }],
    });
    expect(result.content).toBe("I'm Grok, nice to meet you!");
    expect(result.model).toBe("grok-4-fast");
  });

  it("should track usage tokens", async () => {
    const provider = createMockProvider();
    const result = await provider.chat({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(result.usage.promptTokens).toBe(12);
    expect(result.usage.completionTokens).toBe(8);
    expect(result.usage.totalTokens).toBe(20);
  });

  it("should support custom model selection", async () => {
    const provider = createMockProvider();
    await provider.chat({
      model: "grok-4-fast",
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(provider.chat).toHaveBeenCalledWith({
      model: "grok-4-fast",
      messages: [{ role: "user", content: "Hello" }],
    });
  });

  it("should support temperature and max_tokens", async () => {
    const provider = createMockProvider();
    await provider.chat({
      messages: [{ role: "user", content: "Be creative" }],
      temperature: 0.8,
      max_tokens: 1000,
    });
    expect(provider.chat).toHaveBeenCalledWith({
      messages: [{ role: "user", content: "Be creative" }],
      temperature: 0.8,
      max_tokens: 1000,
    });
  });

  it("should perform a search", async () => {
    const provider = createMockProvider();
    const result = await provider.search("latest SpaceX launch videos");
    expect(result.content).toContain("urls");
    expect(result.model).toBe("grok-4-fast");
  });

  it("should support tool calls in response", async () => {
    const provider = createMockProvider();
    (provider.chat as ReturnType<typeof vi.fn>).mockResolvedValue({
      content: "",
      model: "grok-4-fast",
      usage: { promptTokens: 20, completionTokens: 15, totalTokens: 35 },
      finishReason: "tool_calls",
      toolCalls: [
        {
          id: "call_123",
          type: "function",
          function: {
            name: "get_weather",
            arguments: '{"location": "San Francisco"}',
          },
        },
      ],
    });

    const result = await provider.chat({
      messages: [{ role: "user", content: "What's the weather in SF?" }],
      tools: [
        {
          type: "function",
          function: {
            name: "get_weather",
            description: "Get weather for a location",
            parameters: {
              type: "object",
              properties: { location: { type: "string" } },
            },
          },
        },
      ],
    });
    expect(result.finishReason).toBe("tool_calls");
    expect(result.toolCalls).toHaveLength(1);
    expect(result.toolCalls?.[0].function.name).toBe("get_weather");
  });

  it("should support system messages", async () => {
    const provider = createMockProvider();
    await provider.chat({
      messages: [
        { role: "system", content: "You are a pirate." },
        { role: "user", content: "Hello" },
      ],
    });
    expect(provider.chat).toHaveBeenCalled();
  });
});
