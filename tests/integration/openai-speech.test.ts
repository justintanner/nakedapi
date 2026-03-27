import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@nakedapi/openai";

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

    const result = await provider.v1.audio.speech({
      model: "tts-1",
      input: "Hello, this is a test of the text to speech API.",
      voice: "alloy",
      response_format: "mp3",
    });

    expect(result.audioData).toBeInstanceOf(ArrayBuffer);
    expect(result.audioData.byteLength).toBeGreaterThan(0);
    expect(result.contentType).toContain("audio");
  });
});
