import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("kie aleph integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should submit a video transformation task", async () => {
    ctx = setupPolly("kie/aleph-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit video-to-video transformation
    const task = await provider.aleph.api.v1.aleph.generate({
      prompt: "Transform into an anime art style",
      videoUrl:
        "https://static.aiquickdraw.com/tools/example/sample-video.mp4",
      aspectRatio: "16:9",
    });

    // API may return 200 (success) or 402 (insufficient credits)
    expect([200, 402]).toContain(task.code);

    if (task.code === 200) {
      expect(task.data?.taskId).toBeTruthy();
    }
  }, 30_000);

  it("should validate generate payload schema", () => {
    const provider = kie({ apiKey: "test-key" });
    const method = provider.aleph.api.v1.aleph.generate;

    expect(method.payloadSchema.method).toBe("POST");
    expect(method.payloadSchema.path).toBe(
      "/api/v1/aleph/generate"
    );
    expect(method.payloadSchema.fields.prompt.required).toBe(true);
    expect(method.payloadSchema.fields.videoUrl.required).toBe(true);

    const result = method.validatePayload({
      prompt: "test transform",
      videoUrl: "https://example.com/video.mp4",
    });
    expect(result.valid).toBe(true);
  });
});
