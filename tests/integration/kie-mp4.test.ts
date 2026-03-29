import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie mp4", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should call mp4 generate endpoint", async () => {
    ctx = setupPolly("kie/mp4-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "sk-test-key",
    });
    const result = await provider.api.v1.mp4.generate({
      taskId: "test-task-id",
      audioId: "test-audio-id",
      callBackUrl: "https://example.com/callback",
    });
    // API returns 422 for non-existent task IDs — validates endpoint is wired
    expect(result.code).toBeDefined();
    expect(result.msg).toBeDefined();
  });

  it("should get mp4 record info", async () => {
    ctx = setupPolly("kie/mp4-record-info");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "sk-test-key",
    });
    const result = await provider.api.v1.mp4.recordInfo("test-task-id");
    expect(result.code).toBe(200);
    expect(result.msg).toBe("success");
  });

  it("should expose payloadSchema on generate", () => {
    const provider = kie({ apiKey: "sk-test-key" });
    expect(provider.api.v1.mp4.generate.payloadSchema).toBeDefined();
    expect(provider.api.v1.mp4.generate.payloadSchema.method).toBe("POST");
    expect(provider.api.v1.mp4.generate.payloadSchema.path).toBe(
      "/api/v1/mp4/generate"
    );
  });

  it("should validate mp4 generate payload", () => {
    const provider = kie({ apiKey: "sk-test-key" });

    const valid = provider.api.v1.mp4.generate.validatePayload({
      taskId: "abc",
      audioId: "def",
      callBackUrl: "https://example.com/cb",
    });
    expect(valid.valid).toBe(true);

    const invalid = provider.api.v1.mp4.generate.validatePayload({});
    expect(invalid.valid).toBe(false);
  });
});
