import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { googleGemini } from "@nakedapi/google-gemini";

describe("google-gemini generateContent", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("google-gemini/generate-hello");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate content", async () => {
    const provider = googleGemini({
      apiKey:
        process.env.GOOGLE_GEMINI_API_KEY ??
        process.env.GEMINI_API_KEY ??
        "test-key",
    });
    const result = await provider.v1beta.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Say hello in one sentence." }] },
      ],
    });
    expect(result.candidates).toBeDefined();
    expect(result.candidates!.length).toBeGreaterThan(0);
    expect(result.candidates![0].content.parts.length).toBeGreaterThan(0);
    expect(result.usageMetadata?.totalTokenCount).toBeGreaterThan(0);
  });
});

describe("google-gemini countTokens", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("google-gemini/count-tokens");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should count tokens", async () => {
    const provider = googleGemini({
      apiKey:
        process.env.GOOGLE_GEMINI_API_KEY ??
        process.env.GEMINI_API_KEY ??
        "test-key",
    });
    const result = await provider.v1beta.models.countTokens({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: "Hello, world!" }] }],
    });
    expect(result.totalTokens).toBeGreaterThan(0);
  });
});
