import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie style generate", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate an enhanced music style", async () => {
    ctx = setupPolly("kie/style-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "sk-test-key",
    });
    const result = await provider.api.v1.style.generate({
      content: "Pop, Mysterious",
    });
    expect(result.code).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data?.result).toBeTruthy();
  });

  it("should expose payloadSchema", () => {
    const provider = kie({ apiKey: "sk-test-key" });
    expect(provider.api.v1.style.generate.payloadSchema).toBeDefined();
    expect(provider.api.v1.style.generate.payloadSchema.method).toBe("POST");
    expect(provider.api.v1.style.generate.payloadSchema.path).toBe(
      "/api/v1/style/generate"
    );
  });

  it("should validate payload", () => {
    const provider = kie({ apiKey: "sk-test-key" });

    const valid = provider.api.v1.style.generate.validatePayload({
      content: "Pop, Mysterious",
    });
    expect(valid.valid).toBe(true);

    const invalid = provider.api.v1.style.generate.validatePayload({});
    expect(invalid.valid).toBe(false);
  });
});
