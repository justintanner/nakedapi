import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { fal } from "@nakedapi/fal";

describe("fal workflows integration", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("fal/workflows");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should list workflows", async () => {
    const provider = fal({
      apiKey: process.env.FAL_API_KEY ?? "fal-test-key",
    });
    const result = await provider.v1.workflows();
    expect(result.workflows).toBeDefined();
    expect(Array.isArray(result.workflows)).toBe(true);
  });

  it("should handle workflow not found error", async () => {
    const provider = fal({
      apiKey: process.env.FAL_API_KEY ?? "fal-test-key",
    });
    // This workflow doesn't exist - expect a 404 error
    await expect(
      provider.v1.workflows.get({
        username: "fal-ai",
        workflow_name: "nonexistent-workflow",
      })
    ).rejects.toThrow(/Workflow not found/);
  });
});
