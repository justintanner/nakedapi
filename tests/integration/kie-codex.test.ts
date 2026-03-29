import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie codex responses", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should complete a codex responses request", async () => {
    ctx = setupPolly("kie/codex-hello");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "sk-test-key",
    });
    const result = await provider.api.v1.responses({
      model: "gpt-5-codex",
      input: "Say hello in one sentence.",
    });
    expect(result.status).toBe("completed");
    expect(result.output).toBeDefined();
    const messageBlock = result.output?.find((b) => b.type === "message");
    expect(messageBlock).toBeDefined();
    expect(result.usage?.total_tokens).toBeGreaterThan(0);
  });

  it("should support reasoning effort", async () => {
    ctx = setupPolly("kie/codex-reasoning");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "sk-test-key",
    });
    const result = await provider.api.v1.responses({
      model: "gpt-5-codex",
      input: "What is 2+2?",
      reasoning: { effort: "low" },
    });
    expect(result.status).toBe("completed");
    expect(result.output).toBeDefined();
  });

  it("should expose payloadSchema", () => {
    const provider = kie({ apiKey: "sk-test-key" });
    expect(provider.api.v1.responses.payloadSchema).toBeDefined();
    expect(provider.api.v1.responses.payloadSchema.method).toBe("POST");
    expect(provider.api.v1.responses.payloadSchema.path).toBe(
      "/api/v1/responses"
    );
  });

  it("should validate payload", () => {
    const provider = kie({ apiKey: "sk-test-key" });
    const valid = provider.api.v1.responses.validatePayload({
      model: "gpt-5-codex",
      input: "Hello",
    });
    expect(valid.valid).toBe(true);

    const invalid = provider.api.v1.responses.validatePayload({});
    expect(invalid.valid).toBe(false);
  });
});
