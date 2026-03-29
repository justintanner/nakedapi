import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("kie flux-kontext integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate an image and poll until complete", async () => {
    ctx = setupPolly("kie/flux-kontext-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit image generation
    const task =
      await provider.fluxKontext.api.v1.flux.kontext.generate({
        prompt: "A futuristic cityscape at night with neon lights",
        model: "flux-kontext-pro",
        aspectRatio: "16:9",
      });
    expect(task.code).toBe(200);
    expect(task.data?.taskId).toBeTruthy();

    const taskId = task.data!.taskId!;
    const deadline = Date.now() + 5 * 60 * 1000;
    const pollIntervalMs = ctx.mode === "record" ? 5000 : 0;
    let info: Awaited<
      ReturnType<
        typeof provider.fluxKontext.api.v1.flux.kontext["record-info"]
      >
    >;

    // Poll record-info until complete
    while (Date.now() < deadline) {
      info =
        await provider.fluxKontext.api.v1.flux.kontext[
          "record-info"
        ](taskId);

      if (info.data) {
        // successFlag: 0=GENERATING, 1=SUCCESS, 2=CREATE_TASK_FAILED, 3=GENERATE_FAILED
        if (
          info.data.successFlag !== undefined &&
          info.data.successFlag !== 0
        ) {
          break;
        }
      }

      if (pollIntervalMs > 0) {
        await sleep(pollIntervalMs);
      }
    }

    expect(info!.data?.successFlag).toBe(1);
    expect(info!.data?.response?.resultImageUrl).toBeTruthy();
  }, 330_000);

  it("should validate generate payload schema", () => {
    const provider = kie({ apiKey: "test-key" });
    const method =
      provider.fluxKontext.api.v1.flux.kontext.generate;

    expect(method.payloadSchema.method).toBe("POST");
    expect(method.payloadSchema.path).toBe(
      "/api/v1/flux/kontext/generate"
    );
    expect(method.payloadSchema.fields.prompt.required).toBe(true);

    const result = method.validatePayload({
      prompt: "test image",
    });
    expect(result.valid).toBe(true);
  });
});
