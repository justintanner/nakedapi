import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai } from "@nakedapi/xai";

// SKIP: recordings contain 429 rate-limit responses — re-record when API limits clear
describe.skip("xAI batches cancel integration", () => {
  let ctx: PollyContext;

  beforeEach(() => {
    ctx = setupPolly("xai/batches-cancel");
  });

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should cancel a batch", async () => {
    const provider = xai({
      apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
    });

    // First create a batch
    const batch = await provider.post.v1.batches({
      name: "test-batch-for-cancel",
    });
    expect(batch.batch_id).toBeDefined();

    // Then cancel it
    const cancelledBatch = await provider.post.v1.batches.cancel(
      batch.batch_id
    );
    expect(cancelledBatch).toBeDefined();
    expect(cancelledBatch.batch_id).toBe(batch.batch_id);
  });
});
