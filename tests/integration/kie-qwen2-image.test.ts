import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kie } from "@nakedapi/kie";

describe("kie qwen2/text-to-image integration", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("kie/qwen2-text-to-image");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should create a text-to-image task and poll status", async () => {
    const provider = kie({
      apiKey: process.env.KIE_API_KEY ?? "test-key",
    });

    const task = await provider.api.v1.jobs.createTask({
      model: "qwen2/text-to-image",
      input: {
        prompt: "A serene mountain landscape at sunrise",
        image_size: "16:9",
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
