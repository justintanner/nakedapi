import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { readStepOutput } from "../e2e-helpers";
import { xai } from "@nakedapi/xai";

const PIPELINE = "xai/e2e-image-to-video";

describe("xai E2E: image → video → extend", () => {
  let ctx: PollyContext;

  describe("step 1: generate image", () => {
    beforeEach(() => {
      ctx = setupPolly(`${PIPELINE}/step-1-generate-image`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should generate an image from a prompt", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.images.generations({
        prompt: "A red sports car parked in a desert landscape at golden hour",
        model: "grok-imagine-image",
        n: 1,
        response_format: "url",
      });

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].url).toBeTruthy();
    });
  });

  describe("step 2: image to video", () => {
    let imageUrl: string;

    beforeEach(() => {
      imageUrl = readStepOutput(
        `${PIPELINE}/step-1-generate-image`,
        "image_url"
      );
      ctx = setupPolly(`${PIPELINE}/step-2-image-to-video`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should generate a video using the image as first frame", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.videos.generations({
        prompt: "The car drives across the desert, kicking up dust behind it",
        model: "grok-imagine-video",
        image_url: imageUrl,
      });

      expect(result.request_id).toBeTruthy();
      expect(typeof result.request_id).toBe("string");
    });
  });

  describe("step 3: extend video", () => {
    let videoUrl: string;

    beforeEach(() => {
      videoUrl = readStepOutput(
        `${PIPELINE}/step-2-image-to-video`,
        "video_url"
      );
      ctx = setupPolly(`${PIPELINE}/step-3-extend-video`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should extend the video with a new prompt", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.videos.generations({
        prompt:
          "The car accelerates and disappears over the horizon in a cloud of dust",
        model: "grok-imagine-video",
        video_url: videoUrl,
      });

      expect(result.request_id).toBeTruthy();
      expect(typeof result.request_id).toBe("string");
    });
  });
});
