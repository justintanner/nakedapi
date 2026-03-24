import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { readStepOutput } from "../e2e-helpers";
import { kie } from "@nakedapi/kie";

const PIPELINE = "kie/e2e-motion-control";

describe("kie E2E: character image → motion-control", () => {
  let ctx: PollyContext;

  describe("step 1: generate character profile", () => {
    beforeEach(() => {
      ctx = setupPolly(`${PIPELINE}/step-1-generate-image`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should generate a 9:16 character portrait", async () => {
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      const task = await provider.api.v1.jobs.createTask({
        model: "nano-banana-pro",
        input: {
          prompt:
            "A young woman in a bright red hoodie and dark jeans, " +
            "standing upright facing the camera, full body visible " +
            "from head to feet, friendly expression, simple solid " +
            "light gray background, clean studio lighting, sharp " +
            "details, character design, portrait photography",
          aspect_ratio: "9:16",
          resolution: "1K",
          output_format: "png",
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

  describe("step 2: animate character (panoramic)", () => {
    let imageUrl: string;

    beforeEach(() => {
      imageUrl = readStepOutput(
        `${PIPELINE}/step-1-generate-image`,
        "result_url"
      );
      ctx = setupPolly(`${PIPELINE}/step-2-panoramic-video`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a 360 panoramic video from the character image", async () => {
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      const task = await provider.api.v1.jobs.createTask({
        model: "grok-imagine/image-to-video",
        input: {
          image_urls: [imageUrl],
          prompt:
            "Slow 360-degree camera orbit around the character, " +
            "smooth cinematic rotation, the character remains still " +
            "while the camera circles them, studio lighting",
          mode: "normal",
          duration: "6",
          resolution: "480p",
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

  describe("step 3: generate motion reference video", () => {
    beforeEach(() => {
      ctx = setupPolly(`${PIPELINE}/step-3-motion-reference`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should generate a dancing reference video of a regular man", async () => {
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      const task = await provider.api.v1.jobs.createTask({
        model: "grok-imagine/text-to-video",
        input: {
          prompt:
            "A regular man in casual clothes dancing energetically " +
            "in a studio with a plain white background, full body " +
            "visible, smooth movements, well-lit",
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

  describe("step 4: apply motion control", () => {
    let characterImageUrl: string;
    let motionVideoUrl: string;

    beforeEach(() => {
      characterImageUrl = readStepOutput(
        `${PIPELINE}/step-1-generate-image`,
        "result_url"
      );
      motionVideoUrl = readStepOutput(
        `${PIPELINE}/step-3-motion-reference`,
        "result_url"
      );
      ctx = setupPolly(`${PIPELINE}/step-4-motion-control`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should apply dancing motion to the character image", async () => {
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      const task = await provider.api.v1.jobs.createTask({
        model: "kling-3.0/motion-control",
        input: {
          prompt: "The character is dancing energetically.",
          input_urls: [characterImageUrl],
          video_urls: [motionVideoUrl],
          mode: "720p",
          character_orientation: "video",
          background_source: "input_video",
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
});
