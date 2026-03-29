import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { cohere } from "@nakedapi/cohere";

describe("cohere rerank integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  // POST /v2/rerank
  it("should rerank documents by relevance", async () => {
    ctx = setupPolly("cohere/rerank");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v2.rerank({
      model: "rerank-v3.5",
      query: "What is the capital of France?",
      documents: [
        "Paris is the capital of France.",
        "Berlin is the capital of Germany.",
        "Tokyo is the capital of Japan.",
      ],
      top_n: 2,
    });
    expect(result.id).toBeTruthy();
    expect(result.results.length).toBe(2);
    expect(result.results[0].index).toBe(0);
    expect(result.results[0].relevance_score).toBeGreaterThan(0);
  });

  // Schema validation
  it("should expose payloadSchema and validatePayload for rerank", () => {
    const provider = cohere({ apiKey: "test-key" });
    const endpoint = provider.v2.rerank;
    expect(endpoint.payloadSchema).toBeDefined();
    expect(endpoint.payloadSchema.method).toBe("POST");
    expect(endpoint.payloadSchema.path).toBe("/v2/rerank");

    const valid = endpoint.validatePayload({
      model: "rerank-v3.5",
      query: "test",
      documents: ["doc1"],
    });
    expect(valid.valid).toBe(true);

    const invalid = endpoint.validatePayload({});
    expect(invalid.valid).toBe(false);
  });
});
