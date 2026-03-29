import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { cohere } from "@nakedapi/cohere";

describe("cohere models integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  // GET /v1/models
  it("should list all models", async () => {
    ctx = setupPolly("cohere/models-list");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1.models();
    expect(Array.isArray(result.models)).toBe(true);
    expect(result.models.length).toBeGreaterThan(0);
    expect(result.models[0].name).toBeTruthy();
  });

  // GET /v1/models/{model}
  it("should get a single model by name", async () => {
    ctx = setupPolly("cohere/models-get");
    const provider = cohere({
      apiKey: process.env.COHERE_API_KEY ?? "test-key",
    });
    const result = await provider.v1.models.retrieve("command-r-plus");
    expect(result.name).toBe("command-r-plus");
    expect(Array.isArray(result.endpoints)).toBe(true);
  });
});
