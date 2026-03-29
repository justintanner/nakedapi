import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("kie runway integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate a video and poll until complete", async () => {
    ctx = setupPolly("kie/runway-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit video generation
    const task = await provider.runway.api.v1.runway.generate({
      prompt: "A golden retriever running through a field of wildflowers",
      duration: 5,
      quality: "720p",
      aspectRatio: "16:9",
    });
    expect(task.code).toBe(200);
    expect(task.data?.taskId).toBeTruthy();

    const taskId = task.data!.taskId!;
    const deadline = Date.now() + 5 * 60 * 1000;
    const pollIntervalMs = ctx.mode === "record" ? 10000 : 0;
    let info: Awaited<
      ReturnType<typeof provider.runway.api.v1.runway["record-detail"]>
    >;

    // Poll record-detail until success or fail
    while (Date.now() < deadline) {
      info = await provider.runway.api.v1.runway["record-detail"](
        taskId
      );

      if (info.data) {
        if (
          info.data.state === "success" ||
          info.data.state === "fail"
        ) {
          break;
        }
      }

      if (pollIntervalMs > 0) {
        await sleep(pollIntervalMs);
      }
    }

    expect(info!.data?.state).toBe("success");
    expect(info!.data?.videoInfo?.videoUrl).toBeTruthy();
  }, 330_000);

  it("should validate generate payload schema", () => {
    const provider = kie({ apiKey: "test-key" });
    const method = provider.runway.api.v1.runway.generate;

    expect(method.payloadSchema.method).toBe("POST");
    expect(method.payloadSchema.path).toBe(
      "/api/v1/runway/generate"
    );
    expect(method.payloadSchema.fields.prompt.required).toBe(true);
    expect(method.payloadSchema.fields.duration.required).toBe(true);
    expect(method.payloadSchema.fields.quality.required).toBe(true);

    const result = method.validatePayload({
      prompt: "test",
      duration: 5,
      quality: "720p",
    });
    expect(result.valid).toBe(true);
  });

  it("should validate extend payload schema", () => {
    const provider = kie({ apiKey: "test-key" });
    const method = provider.runway.api.v1.runway.extend;

    expect(method.payloadSchema.method).toBe("POST");
    expect(method.payloadSchema.path).toBe("/api/v1/runway/extend");
    expect(method.payloadSchema.fields.taskId.required).toBe(true);
    expect(method.payloadSchema.fields.prompt.required).toBe(true);
    expect(method.payloadSchema.fields.quality.required).toBe(true);

    const result = method.validatePayload({
      taskId: "abc",
      prompt: "continue",
      quality: "720p",
    });
    expect(result.valid).toBe(true);
  });
});
