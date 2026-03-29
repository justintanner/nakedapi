import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("kie gpt4o-image integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate an image and poll until complete", async () => {
    ctx = setupPolly("kie/gpt4o-image-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit image generation
    const task = await provider.gpt4oImage.api.v1["gpt4o-image"].generate({
      prompt: "A serene mountain lake at sunset with reflections",
      size: "1:1",
    });
    expect(task.code).toBe(200);
    expect(task.data?.taskId).toBeTruthy();

    const taskId = task.data!.taskId!;
    const deadline = Date.now() + 5 * 60 * 1000;
    const pollIntervalMs = ctx.mode === "record" ? 5000 : 0;
    let info: Awaited<
      ReturnType<
        typeof provider.gpt4oImage.api.v1["gpt4o-image"]["record-info"]
      >
    >;

    // Poll record-info until success or fail
    while (Date.now() < deadline) {
      info = await provider.gpt4oImage.api.v1["gpt4o-image"][
        "record-info"
      ](taskId);

      if (info.data) {
        if (
          info.data.status === "SUCCESS" ||
          info.data.status === "GENERATE_FAILED" ||
          info.data.status === "CREATE_TASK_FAILED"
        ) {
          break;
        }
      }

      if (pollIntervalMs > 0) {
        await sleep(pollIntervalMs);
      }
    }

    expect(info!.data?.status).toBe("SUCCESS");
    expect(info!.data?.response?.resultUrls).toBeInstanceOf(Array);
    expect(info!.data!.response!.resultUrls!.length).toBeGreaterThan(0);
    expect(info!.data!.response!.resultUrls![0]).toMatch(/^https?:\/\//);
  }, 330_000);

  it("should validate generate payload schema", () => {
    const provider = kie({ apiKey: "test-key" });
    const method =
      provider.gpt4oImage.api.v1["gpt4o-image"].generate;

    expect(method.payloadSchema.method).toBe("POST");
    expect(method.payloadSchema.path).toBe(
      "/api/v1/gpt4o-image/generate"
    );
    expect(method.payloadSchema.fields.size.required).toBe(true);

    const result = method.validatePayload({ size: "1:1" });
    expect(result.valid).toBe(true);
  });

  it("should validate download-url payload schema", () => {
    const provider = kie({ apiKey: "test-key" });
    const method =
      provider.gpt4oImage.api.v1["gpt4o-image"]["download-url"];

    expect(method.payloadSchema.method).toBe("POST");
    expect(method.payloadSchema.path).toBe(
      "/api/v1/gpt4o-image/download-url"
    );
    expect(method.payloadSchema.fields.taskId.required).toBe(true);
    expect(method.payloadSchema.fields.url.required).toBe(true);

    const result = method.validatePayload({
      taskId: "abc",
      url: "https://example.com",
    });
    expect(result.valid).toBe(true);
  });
});
