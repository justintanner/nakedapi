import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { googleGemini } from "@nakedapi/google-gemini";

describe("google-gemini embedContent", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("google-gemini/embed-content");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should embed content", async () => {
    const provider = googleGemini({
      apiKey:
        process.env.GOOGLE_GEMINI_API_KEY ??
        process.env.GEMINI_API_KEY ??
        "test-key",
    });
    const result = await provider.v1beta.models.embedContent({
      model: "gemini-embedding-001",
      content: { parts: [{ text: "Hello, world!" }] },
    });
    expect(result.embedding).toBeDefined();
    expect(result.embedding.values.length).toBeGreaterThan(0);
  });
});

describe("google-gemini batchEmbedContents", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("google-gemini/batch-embed-contents");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should batch embed contents", async () => {
    const provider = googleGemini({
      apiKey:
        process.env.GOOGLE_GEMINI_API_KEY ??
        process.env.GEMINI_API_KEY ??
        "test-key",
    });
    const result = await provider.v1beta.models.batchEmbedContents({
      model: "gemini-embedding-001",
      requests: [
        { content: { parts: [{ text: "Hello" }] } },
        { content: { parts: [{ text: "World" }] } },
      ],
    });
    expect(result.embeddings).toBeDefined();
    expect(result.embeddings.length).toBe(2);
  });
});
