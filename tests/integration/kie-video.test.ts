import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie grok-imagine video integration", () => {
  let ctx: PollyContext;

  describe("textToVideo", () => {
    beforeEach(() => {
      ctx = setupPolly("kie/grok-text-to-video");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a text-to-video task and poll status", async () => {
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      const task = await provider.api.v1.jobs.createTask({
        model: "grok-imagine/text-to-video",
        input: {
          prompt: "A golden sunset over calm ocean waves",
          duration: "6",
        },
      });

      expect(task.taskId).toBeTruthy();
      expect(typeof task.taskId).toBe("string");

      const info = await provider.api.v1.jobs.recordInfo(task.taskId);

      expect(info.taskId).toBe(task.taskId);
      expect(["waiting", "queuing", "generating", "success", "fail"]).toContain(
        info.state
      );
    });
  });

  describe("videoExtend", () => {
    beforeEach(() => {
      ctx = setupPolly("kie/grok-video-extend");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should extend a completed video by task_id", async () => {
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      // Use a completed text-to-video task_id — extend requires the
      // source video to have finished generating.
      const extend = await provider.api.v1.jobs.createTask({
        model: "grok-imagine/extend",
        input: {
          task_id: "c13f22cfc68d83c319043ade1c1fd401",
          prompt: "The bird lands gracefully on a tree branch",
          extend_at: 0,
          extend_times: "6",
        },
      });

      expect(extend.taskId).toBeTruthy();
      expect(typeof extend.taskId).toBe("string");
    });
  });

  describe("videoUpscale", () => {
    beforeEach(() => {
      ctx = setupPolly("kie/grok-video-upscale");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should upscale a completed video by task_id", async () => {
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      // Use a completed text-to-video task_id — upscale requires the
      // source video to have finished generating.
      const upscale = await provider.api.v1.jobs.createTask({
        model: "grok-imagine/upscale",
        input: {
          task_id: "d43f0d0ab29f28fdfcf68a9dccbd7a42",
        },
      });

      expect(upscale.taskId).toBeTruthy();
      expect(typeof upscale.taskId).toBe("string");
    });
  });
});
