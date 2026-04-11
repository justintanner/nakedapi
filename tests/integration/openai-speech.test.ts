import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@apicity/openai";

describe("openai speech", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate speech audio from text", async () => {
    ctx = setupPolly("openai/speech-hello");

    const provider = openai({
      apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
    });

    const result = await provider.post.v1.audio.speech({
      model: "tts-1",
      input: "Hello, world!",
      voice: "alloy",
      response_format: "mp3",
    });

    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBeGreaterThan(0);
  });

  it("should validate speech payload", () => {
    const provider = openai({ apiKey: "sk-test-key" });

    const valid = provider.post.v1.audio.speech.validatePayload({
      model: "tts-1",
      input: "Hello",
      voice: "alloy",
    });
    expect(valid.valid).toBe(true);
    expect(valid.errors).toHaveLength(0);

    const missing = provider.post.v1.audio.speech.validatePayload({
      model: "tts-1",
    });
    expect(missing.valid).toBe(false);
    expect(missing.errors).toContain("input is required");
    expect(missing.errors).toContain("voice is required");
  });

  it("should expose speech payload schema", () => {
    const provider = openai({ apiKey: "sk-test-key" });
    const schema = provider.post.v1.audio.speech.payloadSchema;

    expect(schema.method).toBe("POST");
    expect(schema.path).toBe("/audio/speech");
    expect(schema.contentType).toBe("application/json");
    expect(schema.fields.model.required).toBe(true);
    expect(schema.fields.input.required).toBe(true);
    expect(schema.fields.voice.required).toBe(true);
  });
});
