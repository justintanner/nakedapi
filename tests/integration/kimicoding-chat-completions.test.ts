import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import {
  kimicoding,
  type ChatCompletionStreamEvent,
} from "@nakedapi/kimicoding";

describe("kimicoding chat completions (OpenAI format)", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should complete a chat request", async () => {
    ctx = setupPolly("kimicoding/chat-completions-basic");
    const provider = kimicoding({
      apiKey: process.env.KIMI_CODING_API_KEY ?? "sk-test-key",
    });
    const result = await provider.coding.v1.chat.completions({
      model: "kimi-for-coding",
      messages: [{ role: "user", content: "Say hello in one word." }],
      max_tokens: 1024,
      temperature: 0,
    });
    expect(result.object).toBe("chat.completion");
    expect(result.choices.length).toBeGreaterThan(0);
    const msg = result.choices[0].message;
    expect(msg.content || msg.reasoning_content).toBeTruthy();
    expect(result.usage.total_tokens).toBeGreaterThan(0);
  });

  it("should stream a chat completion", async () => {
    ctx = setupPolly("kimicoding/chat-completions-stream");
    const provider = kimicoding({
      apiKey: process.env.KIMI_CODING_API_KEY ?? "sk-test-key",
    });
    const events: ChatCompletionStreamEvent[] = [];
    for await (const event of provider.coding.v1.chat.completions.stream({
      model: "kimi-for-coding",
      messages: [{ role: "user", content: "Say hello in one word." }],
      max_tokens: 1024,
      temperature: 0,
    })) {
      events.push(event);
    }
    expect(events.length).toBeGreaterThan(0);
    expect(
      events.some(
        (e) =>
          e.choices?.[0]?.delta?.content !== undefined ||
          e.choices?.[0]?.finish_reason !== null
      )
    ).toBe(true);
  });
});
