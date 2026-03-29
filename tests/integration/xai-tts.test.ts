import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai } from "@nakedapi/xai";

describe("xai tts integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  // GET /v1/tts/voices
  it("should list all voices", async () => {
    ctx = setupPolly("xai/tts-voices-list");
    const provider = xai({
      apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
    });
    const result = await provider.v1.tts.voices();
    expect(Array.isArray(result.voices)).toBe(true);
    expect(result.voices.length).toBeGreaterThan(0);
    const voice = result.voices[0];
    expect(voice.voice_id).toBeTruthy();
    expect(voice.name).toBeTruthy();
    expect("language" in voice).toBe(true);
  });

  // GET /v1/tts/voices/{voice_id}
  it("should get a single voice by id", async () => {
    ctx = setupPolly("xai/tts-voices-get");
    const provider = xai({
      apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
    });
    const result = await provider.v1.tts.voices("eve");
    expect(result.voice_id).toBe("eve");
    expect(result.name).toBeTruthy();
    expect("language" in result).toBe(true);
  });

  // POST /v1/tts
  it("should synthesize text to audio", async () => {
    ctx = setupPolly("xai/tts-synthesize");
    const provider = xai({
      apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
    });
    const result = await provider.v1.tts({
      text: "Hello world",
      language: "en",
      output_format: {
        codec: "mp3",
        sample_rate: 24000,
      },
    });
    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBeGreaterThan(0);
  });

  // Payload schema
  it("should expose tts payloadSchema", () => {
    const provider = xai({ apiKey: "sk-test-key" });
    expect(provider.v1.tts.payloadSchema).toBeDefined();
    expect(provider.v1.tts.payloadSchema.method).toBe("POST");
    expect(provider.v1.tts.payloadSchema.path).toBe("/tts");
    expect(provider.v1.tts.payloadSchema.fields.text).toBeDefined();
    expect(provider.v1.tts.payloadSchema.fields.text.required).toBe(true);
    expect(provider.v1.tts.payloadSchema.fields.language).toBeDefined();
    expect(provider.v1.tts.payloadSchema.fields.output_format).toBeDefined();
  });

  // Payload validation
  it("should validate tts payload", () => {
    const provider = xai({ apiKey: "sk-test-key" });
    const valid = provider.v1.tts.validatePayload({
      text: "Hello",
      language: "en",
      output_format: { codec: "mp3" },
    });
    expect(valid.valid).toBe(true);
    expect(valid.errors).toHaveLength(0);

    const invalid = provider.v1.tts.validatePayload({
      language: "en",
    });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });
});
