import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { cohere } from "@nakedapi/cohere";

describe("cohere classify integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  // POST /v1/classify
  it("should classify text inputs", async () => {
    ctx = setupPolly("cohere/classify");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1.classify({
      inputs: ["This is great!", "This is terrible."],
      examples: [
        { text: "I love it", label: "positive" },
        { text: "I hate it", label: "negative" },
        { text: "Amazing work", label: "positive" },
        { text: "Awful experience", label: "negative" },
      ],
    });
    expect(result.id).toBeTruthy();
    expect(result.classifications.length).toBe(2);
    expect(result.classifications[0].prediction).toBeTruthy();
    expect(typeof result.classifications[0].confidence).toBe("number");
  });

  // Schema validation
  it("should expose payloadSchema and validatePayload for classify", () => {
    const provider = cohere({ apiKey: "test-key" });
    const endpoint = provider.v1.classify;
    expect(endpoint.payloadSchema).toBeDefined();
    expect(endpoint.payloadSchema.method).toBe("POST");
    expect(endpoint.payloadSchema.path).toBe("/v1/classify");

    const valid = endpoint.validatePayload({
      inputs: ["test"],
    });
    expect(valid.valid).toBe(true);

    const invalid = endpoint.validatePayload({});
    expect(invalid.valid).toBe(false);
  });

  // POST /v1/summarize
  it("should summarize text", async () => {
    ctx = setupPolly("cohere/summarize");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1.summarize({
      text: "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet. It has been used as a typing exercise for many years. The phrase originated in the late 19th century and has been widely adopted for font testing and keyboard practice.",
      length: "short",
      format: "paragraph",
    });
    expect(result.id).toBeTruthy();
    expect(result.summary).toBeTruthy();
  });
});
