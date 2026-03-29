import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { cohere } from "@nakedapi/cohere";

describe("cohere chat integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  // POST /v2/chat
  it("should complete a v2 chat request", async () => {
    ctx = setupPolly("cohere/chat-v2");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v2.chat({
      model: "command-a-03-2025",
      messages: [{ role: "user", content: "Say hello in one sentence." }],
      temperature: 0,
    });
    expect(result.id).toBeTruthy();
    expect(result.finish_reason).toBe("COMPLETE");
    expect(result.message).toBeDefined();
    expect(result.usage.input_tokens).toBeGreaterThan(0);
    expect(result.usage.output_tokens).toBeGreaterThan(0);
  });

  // POST /v1/chat (legacy)
  it("should complete a v1 chat request", async () => {
    ctx = setupPolly("cohere/chat-v1");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1.chat({
      message: "Say hello in one sentence.",
      model: "command-r-plus",
      temperature: 0,
    });
    expect(result.text).toBeTruthy();
    expect(result.generation_id).toBeTruthy();
  });

  // Schema validation
  it("should expose payloadSchema and validatePayload for v2 chat", () => {
    const provider = cohere({ apiKey: "test-key" });
    const endpoint = provider.v2.chat;
    expect(endpoint.payloadSchema).toBeDefined();
    expect(endpoint.payloadSchema.method).toBe("POST");
    expect(endpoint.payloadSchema.path).toBe("/v2/chat");

    const valid = endpoint.validatePayload({
      model: "command-a-03-2025",
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(valid.valid).toBe(true);
    expect(valid.errors).toHaveLength(0);

    const invalid = endpoint.validatePayload({});
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it("should expose payloadSchema and validatePayload for v1 chat", () => {
    const provider = cohere({ apiKey: "test-key" });
    const endpoint = provider.v1.chat;
    expect(endpoint.payloadSchema).toBeDefined();
    expect(endpoint.payloadSchema.method).toBe("POST");
    expect(endpoint.payloadSchema.path).toBe("/v1/chat");

    const valid = endpoint.validatePayload({ message: "Hello" });
    expect(valid.valid).toBe(true);

    const invalid = endpoint.validatePayload({});
    expect(invalid.valid).toBe(false);
  });
});
