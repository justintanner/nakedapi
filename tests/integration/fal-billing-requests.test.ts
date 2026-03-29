import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { fal } from "@nakedapi/fal";

describe("fal billing-events and requests/search", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should get billing events", async () => {
    ctx = setupPolly("fal/billing-events");
    const provider = fal({
      apiKey: process.env.FAL_API_KEY ?? "fal-test-key",
    });
    const result = await provider.v1.models["billing-events"]({
      limit: 5,
    });
    expect(result).toBeDefined();
    expect(result.has_more).toBeDefined();
    expect(Array.isArray(result.billing_events)).toBe(true);
    expect(result.billing_events.length).toBeGreaterThan(0);
    expect(result.billing_events[0].endpoint_id).toBeTruthy();
    expect(result.billing_events[0].request_id).toBeTruthy();
    expect(typeof result.billing_events[0].unit_price).toBe("number");
    expect(typeof result.billing_events[0].cost_estimate_nano_usd).toBe(
      "number"
    );
  });

  it("should get billing events for endpoint", async () => {
    ctx = setupPolly("fal/billing-events-endpoint");
    const provider = fal({
      apiKey: process.env.FAL_API_KEY ?? "fal-test-key",
    });
    const result = await provider.v1.models["billing-events"]({
      endpoint_id: "fal-ai/flux/dev",
      limit: 5,
    });
    expect(result).toBeDefined();
    expect(result.has_more).toBeDefined();
    expect(Array.isArray(result.billing_events)).toBe(true);
  });

  it("should search requests", async () => {
    ctx = setupPolly("fal/requests-search");
    const provider = fal({
      apiKey: process.env.FAL_API_KEY ?? "fal-test-key",
    });
    const result = await provider.v1.models.requests.search({
      limit: 5,
    });
    expect(result).toBeDefined();
    expect(result.has_more).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results[0].request_id).toBeTruthy();
    expect(result.results[0].endpoint_id).toBeTruthy();
  });

  it("should search requests with endpoint filter", async () => {
    ctx = setupPolly("fal/requests-search-endpoint");
    const provider = fal({
      apiKey: process.env.FAL_API_KEY ?? "fal-test-key",
    });
    const result = await provider.v1.models.requests.search({
      endpoint_id: "fal-ai/flux/dev",
      limit: 5,
    });
    expect(result).toBeDefined();
    expect(result.has_more).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
  });
});
