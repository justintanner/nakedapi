import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { mistral } from "@nakedapi/mistral";

describe("mistral integration", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("mistral/chat-hello");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should complete a chat request", async () => {
    const provider = mistral({
      apiKey: process.env.MISTRAL_API_KEY ?? "sk-test-key",
    });
    const result = await provider.v1.chat.completions({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "Say hello in one sentence." }],
      temperature: 0,
    });
    expect(result.choices[0].message.content).toBeTruthy();
    expect(result.usage?.total_tokens).toBeGreaterThan(0);
  });
});
