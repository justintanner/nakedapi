import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("kie veo integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should generate a video and poll until complete", async () => {
    ctx = setupPolly("kie/veo-generate");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit the generation task
    const task = await provider.veo.api.v1.veo.generate({
      prompt: "A cat walking across a sunlit garden path",
      model: "veo3",
      aspectRatio: "16:9",
    });
    expect(task.code).toBe(200);
    expect(task.data?.taskId).toBeTruthy();

    const taskId = task.data!.taskId!;
    const deadline = Date.now() + 5 * 60 * 1000;
    const pollIntervalMs = ctx.mode === "record" ? 5000 : 0;
    let finalState: string | undefined;
    let resultJson: string | undefined;

    // Poll recordInfo every few seconds until success, fail, or timeout.
    // The API may return null data initially while the task is being queued.
    while (Date.now() < deadline) {
      const info = await provider.api.v1.jobs.recordInfo(taskId);

      if (info.data && info.data.taskId) {
        expect(info.data.taskId).toBe(taskId);
        finalState = info.data.state;

        if (finalState === "success") {
          resultJson = info.data.resultJson;
          break;
        }
        if (finalState === "fail") {
          break;
        }
      }

      if (pollIntervalMs > 0) {
        await sleep(pollIntervalMs);
      }
    }

    expect(finalState).toBe("success");
    expect(resultJson).toBeTruthy();

    const result = JSON.parse(resultJson!);
    expect(result.works).toBeInstanceOf(Array);
    expect(result.works.length).toBeGreaterThan(0);
    expect(result.works[0].resource).toBeTruthy();
  }, 330_000);

  it("should get record-info for a veo task", async () => {
    ctx = setupPolly("kie/veo-record-info");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit a generation task first
    const task = await provider.veo.api.v1.veo.generate({
      prompt: "A bird flying over the ocean at sunset",
      model: "veo3",
      aspectRatio: "16:9",
    });
    expect(task.code).toBe(200);
    expect(task.data?.taskId).toBeTruthy();

    const taskId = task.data!.taskId!;
    const deadline = Date.now() + 5 * 60 * 1000;
    const pollIntervalMs = ctx.mode === "record" ? 5000 : 0;
    let finalState: string | undefined;

    // Poll veo record-info until success or fail
    while (Date.now() < deadline) {
      const info = await provider.veo.api.v1.veo["record-info"](taskId);

      if (info.data && info.data.taskId) {
        expect(info.data.taskId).toBe(taskId);
        finalState = info.data.state;

        if (finalState === "success" || finalState === "fail") {
          break;
        }
      }

      if (pollIntervalMs > 0) {
        await sleep(pollIntervalMs);
      }
    }

    expect(finalState).toBe("success");
  }, 330_000);

  it("should request get-1080p for a completed veo task", async () => {
    ctx = setupPolly("kie/veo-get-1080p");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit a generation task first
    const task = await provider.veo.api.v1.veo.generate({
      prompt: "A slow-motion waterfall in a mountain forest",
      model: "veo3_fast",
      aspectRatio: "16:9",
    });
    expect(task.code).toBe(200);
    const taskId = task.data!.taskId!;

    // Poll until complete
    const deadline = Date.now() + 5 * 60 * 1000;
    const pollIntervalMs = ctx.mode === "record" ? 5000 : 0;
    let done = false;

    while (Date.now() < deadline) {
      const info = await provider.veo.api.v1.veo["record-info"](taskId);
      if (info.data?.state === "success") {
        done = true;
        break;
      }
      if (info.data?.state === "fail") break;
      if (pollIntervalMs > 0) await sleep(pollIntervalMs);
    }

    expect(done).toBe(true);

    // Request 1080p version
    const res = await provider.veo.api.v1.veo["get-1080p"](taskId);
    expect(res.code).toBe(200);
  }, 330_000);

  it("should request get-4k for a completed veo task", async () => {
    ctx = setupPolly("kie/veo-get-4k");
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    // Submit a generation task first
    const task = await provider.veo.api.v1.veo.generate({
      prompt: "A timelapse of clouds moving over a city skyline",
      model: "veo3_fast",
      aspectRatio: "16:9",
    });
    expect(task.code).toBe(200);
    const taskId = task.data!.taskId!;

    // Poll until complete
    const deadline = Date.now() + 5 * 60 * 1000;
    const pollIntervalMs = ctx.mode === "record" ? 5000 : 0;
    let done = false;

    while (Date.now() < deadline) {
      const info = await provider.veo.api.v1.veo["record-info"](taskId);
      if (info.data?.state === "success") {
        done = true;
        break;
      }
      if (info.data?.state === "fail") break;
      if (pollIntervalMs > 0) await sleep(pollIntervalMs);
    }

    expect(done).toBe(true);

    // Request 4K version
    const res = await provider.veo.api.v1.veo["get-4k"](taskId);
    expect(res.code).toBe(200);
  }, 330_000);
});
