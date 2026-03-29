import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { googleGemini } from "@nakedapi/google-gemini";

describe("google-gemini models list", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("google-gemini/models-list");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should list models", async () => {
    const provider = googleGemini({
      apiKey:
        process.env.GOOGLE_GEMINI_API_KEY ??
        process.env.GEMINI_API_KEY ??
        "test-key",
    });
    const result = await provider.v1beta.models();
    expect("models" in result).toBe(true);
    const listResult = result as { models: unknown[] };
    expect(listResult.models.length).toBeGreaterThan(0);
  });
});

describe("google-gemini models get", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("google-gemini/models-get");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should get a model", async () => {
    const provider = googleGemini({
      apiKey:
        process.env.GOOGLE_GEMINI_API_KEY ??
        process.env.GEMINI_API_KEY ??
        "test-key",
    });
    const result = await provider.v1beta.models("gemini-2.5-flash");
    expect("name" in result).toBe(true);
    const model = result as { name: string; displayName: string };
    expect(model.name).toContain("gemini-2.5-flash");
    expect(model.displayName).toBeTruthy();
  });
});
