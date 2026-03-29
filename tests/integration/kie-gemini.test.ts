import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie gemini chat", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should complete a gemini-2.5-flash chat request", async () => {
    ctx = setupPolly("kie/gemini-flash-hello");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "sk-test-key",
    });
    const result = await provider.gemini[
      "gemini-2.5-flash"
    ].v1.chat.completions({
      messages: [{ role: "user", content: "Say hello in one sentence." }],
    });
    expect(result.choices?.[0].message?.content).toBeTruthy();
    expect(result.usage?.total_tokens).toBeGreaterThan(0);
  });

  it("should complete a gemini-3-flash chat request", async () => {
    ctx = setupPolly("kie/gemini-3-flash-hello");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "sk-test-key",
    });
    const result = await provider.gemini["gemini-3-flash"].v1.chat.completions({
      messages: [{ role: "user", content: "Say hello in one sentence." }],
    });
    expect(result.choices?.[0].message?.content).toBeTruthy();
  });

  it("should expose payloadSchema", () => {
    const provider = kie({ apiKey: "sk-test-key" });
    const schema =
      provider.gemini["gemini-2.5-flash"].v1.chat.completions.payloadSchema;
    expect(schema).toBeDefined();
    expect(schema.method).toBe("POST");
  });

  it("should validate payload", () => {
    const provider = kie({ apiKey: "sk-test-key" });
    const fn = provider.gemini["gemini-2.5-flash"].v1.chat.completions;

    const valid = fn.validatePayload({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(valid.valid).toBe(true);

    const invalid = fn.validatePayload({});
    expect(invalid.valid).toBe(false);
  });
});
