import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { cohere } from "@nakedapi/cohere";

describe("cohere embed integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  // POST /v2/embed
  it("should embed text documents", async () => {
    ctx = setupPolly("cohere/embed-texts");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v2.embed({
      model: "embed-v4.0",
      input_type: "search_document",
      texts: ["Hello world", "Goodbye world"],
      embedding_types: ["float"],
    });
    expect(result.id).toBeTruthy();
    expect(result.embeddings.float).toBeDefined();
    expect(result.embeddings.float!.length).toBe(2);
    expect(result.embeddings.float![0].length).toBeGreaterThan(0);
  });

  // Schema validation
  it("should expose payloadSchema and validatePayload for embed", () => {
    const provider = cohere({ apiKey: "test-key" });
    const endpoint = provider.v2.embed;
    expect(endpoint.payloadSchema).toBeDefined();
    expect(endpoint.payloadSchema.method).toBe("POST");
    expect(endpoint.payloadSchema.path).toBe("/v2/embed");

    const valid = endpoint.validatePayload({
      model: "embed-v4.0",
      input_type: "search_document",
      texts: ["test"],
    });
    expect(valid.valid).toBe(true);

    const invalid = endpoint.validatePayload({});
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });
});
