import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie suno integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate music", async () => {
    ctx = setupPolly("kie/suno-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate({
      prompt: "A cheerful pop song about summer",
      model: "V4",
      instrumental: false,
      customMode: false,
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should extend music", async () => {
    ctx = setupPolly("kie/suno-extend");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate.extend({
      audioId: "test-audio-uuid",
      defaultParamFlag: false,
      model: "V4",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should upload and cover audio", async () => {
    ctx = setupPolly("kie/suno-upload-cover");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate["upload-cover"]({
      uploadUrl: "https://example.com/audio.mp3",
      prompt: "A rock cover version",
      customMode: true,
      instrumental: false,
      model: "V4_5",
      style: "rock",
      title: "Rock Cover",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should upload and extend audio", async () => {
    ctx = setupPolly("kie/suno-upload-extend");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate["upload-extend"]({
      uploadUrl: "https://example.com/audio.mp3",
      defaultParamFlag: false,
      instrumental: false,
      continueAt: 30,
      model: "V4_5",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should add instrumental", async () => {
    ctx = setupPolly("kie/suno-add-instrumental");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate["add-instrumental"]({
      uploadUrl: "https://example.com/vocals.mp3",
      title: "Instrumental Mix",
      tags: "electronic ambient",
      negativeTags: "heavy metal",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should add vocals", async () => {
    ctx = setupPolly("kie/suno-add-vocals");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate["add-vocals"]({
      prompt: "Sing about the ocean waves",
      title: "Ocean Song",
      negativeTags: "screaming",
      style: "pop ballad",
      uploadUrl: "https://example.com/instrumental.mp3",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should replace a section", async () => {
    ctx = setupPolly("kie/suno-replace-section");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate["replace-section"]({
      taskId: "test-task-id",
      audioId: "test-audio-uuid",
      prompt: "A guitar solo bridge",
      tags: "rock guitar",
      title: "My Song",
      infillStartS: 60,
      infillEndS: 90,
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should get timestamped lyrics", async () => {
    ctx = setupPolly("kie/suno-timestamped-lyrics");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate[
      "get-timestamped-lyrics"
    ]({
      taskId: "test-task-id",
      audioId: "test-audio-uuid",
    });

    expect(result.code).toBe(200);
    expect(result.data).toBeTruthy();
    expect(result.data!.alignedWords).toBeInstanceOf(Array);
    expect(result.data!.alignedWords.length).toBeGreaterThan(0);
    expect(result.data!.alignedWords[0]).toHaveProperty("word");
    expect(result.data!.alignedWords[0]).toHaveProperty("startS");
    expect(result.data!.alignedWords[0]).toHaveProperty("endS");
  });

  it("should generate a persona", async () => {
    ctx = setupPolly("kie/suno-generate-persona");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate["generate-persona"]({
      taskId: "test-task-id",
      audioId: "test-audio-uuid",
      name: "Pop Star",
      description: "A bright, energetic pop vocalist",
    });

    expect(result.code).toBe(200);
    expect(result.data).toBeTruthy();
    expect(result.data!.personaId).toBeTruthy();
    expect(result.data!.name).toBe("Pop Star");
  });

  it("should generate a mashup", async () => {
    ctx = setupPolly("kie/suno-mashup");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate.mashup({
      uploadUrlList: [
        "https://example.com/track1.mp3",
        "https://example.com/track2.mp3",
      ],
      customMode: false,
      model: "V4_5",
      prompt: "Blend these two tracks smoothly",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should generate sounds", async () => {
    ctx = setupPolly("kie/suno-sounds");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.generate.sounds({
      prompt: "A gentle rain loop",
      soundLoop: true,
      soundTempo: 90,
      soundKey: "Am",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should generate cover art", async () => {
    ctx = setupPolly("kie/suno-cover-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.suno.cover.generate({
      taskId: "test-task-id",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should generate lyrics", async () => {
    ctx = setupPolly("kie/suno-lyrics");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const result = await provider.suno.api.v1.lyrics({
      prompt: "A love song about stargazing",
    });

    expect(result.code).toBe(200);
    expect(result.data?.taskId).toBeTruthy();
  });

  it("should expose payloadSchema on all endpoints", () => {
    ctx = setupPolly("kie/suno-schemas");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const gen = provider.suno.api.v1.generate;
    expect(gen.payloadSchema.path).toBe("/api/v1/generate");
    expect(gen.extend.payloadSchema.path).toBe("/api/v1/generate/extend");
    expect(gen["upload-cover"].payloadSchema.path).toBe(
      "/api/v1/generate/upload-cover"
    );
    expect(gen["upload-extend"].payloadSchema.path).toBe(
      "/api/v1/generate/upload-extend"
    );
    expect(gen["add-instrumental"].payloadSchema.path).toBe(
      "/api/v1/generate/add-instrumental"
    );
    expect(gen["add-vocals"].payloadSchema.path).toBe(
      "/api/v1/generate/add-vocals"
    );
    expect(gen["replace-section"].payloadSchema.path).toBe(
      "/api/v1/generate/replace-section"
    );
    expect(gen["get-timestamped-lyrics"].payloadSchema.path).toBe(
      "/api/v1/generate/get-timestamped-lyrics"
    );
    expect(gen["generate-persona"].payloadSchema.path).toBe(
      "/api/v1/generate/generate-persona"
    );
    expect(gen.mashup.payloadSchema.path).toBe("/api/v1/generate/mashup");
    expect(gen.sounds.payloadSchema.path).toBe("/api/v1/generate/sounds");
    expect(provider.suno.api.v1.suno.cover.generate.payloadSchema.path).toBe(
      "/api/v1/suno/cover/generate"
    );
    expect(provider.suno.api.v1.lyrics.payloadSchema.path).toBe(
      "/api/v1/lyrics"
    );
  });

  it("should validate payloads", () => {
    ctx = setupPolly("kie/suno-validate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Valid generate payload
    const validResult = provider.suno.api.v1.generate.validatePayload({
      prompt: "test",
      model: "V4",
      instrumental: false,
      customMode: false,
    });
    expect(validResult.valid).toBe(true);
    expect(validResult.errors).toHaveLength(0);

    // Invalid — missing required fields
    const invalidResult = provider.suno.api.v1.generate.validatePayload({});
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);

    // Valid extend payload
    const extendResult = provider.suno.api.v1.generate.extend.validatePayload({
      audioId: "test-uuid",
      defaultParamFlag: true,
      model: "V4_5",
    });
    expect(extendResult.valid).toBe(true);

    // Valid sounds payload
    const soundsResult = provider.suno.api.v1.generate.sounds.validatePayload({
      prompt: "rain",
    });
    expect(soundsResult.valid).toBe(true);
  });
});
