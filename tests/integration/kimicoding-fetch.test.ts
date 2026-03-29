import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kimicoding } from "@nakedapi/kimicoding";

describe("kimicoding fetch integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should fetch a URL and return markdown content", async () => {
    ctx = setupPolly("kimicoding/fetch-url");
    const provider = kimicoding({
      apiKey: process.env.KIMI_CODING_API_KEY ?? "sk-test-key",
    });

    const result = await provider.coding.v1.fetch({
      url: "https://example.com",
    });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
