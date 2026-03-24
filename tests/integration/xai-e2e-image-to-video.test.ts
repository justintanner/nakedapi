import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { readStepOutput } from "../e2e-helpers";
import { xai } from "@nakedapi/xai";

const PIPELINE = "xai/e2e-image-to-video";

describe("xai E2E: astronaut cliff — image → video → extend", () => {
  let ctx: PollyContext;

  describe("step 1: establish the scene", () => {
    beforeEach(() => {
      ctx = setupPolly(`${PIPELINE}/step-1-generate-image`);
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should generate the opening image", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.images.generations({
        prompt:
          "A lone astronaut in a white spacesuit standing at the edge of a " +
          "towering basalt cliff, overlooking a vast bioluminescent alien " +
          "ocean at sunset. Two pale moons hang low on the horizon, casting " +
          "long purple shadows across the rock. Cinematic wide shot, 4K, " +
          "sci-fi concept art style.",
        model: "grok-imagine-image",
        n: 1,
        response_format: "url",
      });

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].url).toBeTruthy();
    });
  });

  describe("step 2: animate the scene", () => {
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

    it("should bring the image to life as video", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.videos.generations({
        prompt:
          "The astronaut takes a cautious step toward the cliff edge and " +
          "looks down. Bioluminescent waves crash against the rocks far " +
          "below, sending up faint glowing spray. The two moons drift " +
          "higher, their light intensifying. Camera slowly pushes in " +
          "toward the astronaut from behind. Cinematic, slow motion.",
        model: "grok-imagine-video",
        image_url: imageUrl,
      });

      expect(result.request_id).toBeTruthy();
      expect(typeof result.request_id).toBe("string");
    });
  });

  describe("step 3: the leap", () => {
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

    it("should extend the video with the astronaut leaping", async () => {
      const provider = xai({
        apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.videos.generations({
        prompt:
          "The astronaut crouches and leaps off the cliff into the void. " +
          "A jetpack ignites with a bright blue flame and the astronaut " +
          "soars out over the glowing ocean, banking left between the two " +
          "moons. The bioluminescent water below ripples in response to " +
          "the engine wash. Camera follows in a sweeping aerial tracking " +
          "shot. Cinematic, epic scale.",
        model: "grok-imagine-video",
        video_url: videoUrl,
      });

      expect(result.request_id).toBeTruthy();
      expect(typeof result.request_id).toBe("string");
    });
  });
});
