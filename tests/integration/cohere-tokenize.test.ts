import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { cohere } from "@nakedapi/cohere";

describe("cohere tokenize integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  // POST /v1/tokenize
  it("should tokenize text", async () => {
    ctx = setupPolly("cohere/tokenize");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1.tokenize({
      text: "Hello world!",
      model: "command-r-plus",
    });
    expect(Array.isArray(result.tokens)).toBe(true);
    expect(result.tokens.length).toBeGreaterThan(0);
    expect(Array.isArray(result.token_strings)).toBe(true);
    expect(result.token_strings.length).toBe(result.tokens.length);
  });

  // POST /v1/detokenize
  it("should detokenize tokens", async () => {
    ctx = setupPolly("cohere/detokenize");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1.detokenize({
      tokens: [33555, 1114, 34],
      model: "command-r-plus",
    });
    expect(typeof result.text).toBe("string");
    expect(result.text.length).toBeGreaterThan(0);
  });

  // POST /v1/check-api-key
  it("should check API key validity", async () => {
    ctx = setupPolly("cohere/check-api-key");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1["check-api-key"]();
    expect(typeof result.valid).toBe("boolean");
  });

  // Schema validation
  it("should expose payloadSchema and validatePayload for tokenize", () => {
    const provider = cohere({ apiKey: "test-key" });
    const endpoint = provider.v1.tokenize;
    expect(endpoint.payloadSchema).toBeDefined();
    expect(endpoint.payloadSchema.method).toBe("POST");
    expect(endpoint.payloadSchema.path).toBe("/v1/tokenize");

    const valid = endpoint.validatePayload({
      text: "Hello",
      model: "command-r-plus",
    });
    expect(valid.valid).toBe(true);

    const invalid = endpoint.validatePayload({});
    expect(invalid.valid).toBe(false);
  });

  it("should expose payloadSchema and validatePayload for detokenize", () => {
    const provider = cohere({ apiKey: "test-key" });
    const endpoint = provider.v1.detokenize;
    expect(endpoint.payloadSchema).toBeDefined();
    expect(endpoint.payloadSchema.method).toBe("POST");
    expect(endpoint.payloadSchema.path).toBe("/v1/detokenize");

    const valid = endpoint.validatePayload({
      tokens: [1, 2, 3],
      model: "command-r-plus",
    });
    expect(valid.valid).toBe(true);
  });
});
