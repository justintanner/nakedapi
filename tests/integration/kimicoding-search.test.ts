import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kimicoding } from "@nakedapi/kimicoding";

describe("kimicoding search integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should search the web for a query", async () => {
    ctx = setupPolly("kimicoding/search-basic");
    const provider = kimicoding({
      apiKey: process.env.KIMI_CODING_API_KEY ?? "sk-test-key",
    });

    const result = await provider.coding.v1.search({
      text_query: "TypeScript generics tutorial",
      limit: 3,
    });

    expect(result.search_results).toBeDefined();
    expect(Array.isArray(result.search_results)).toBe(true);
    expect(result.search_results.length).toBeGreaterThan(0);

    const first = result.search_results[0];
    expect(first.title).toBeTruthy();
    expect(first.url).toBeTruthy();
    expect(first.snippet).toBeTruthy();
  });

  it("should search with page crawling enabled", async () => {
    ctx = setupPolly("kimicoding/search-crawl");
    const provider = kimicoding({
      apiKey: process.env.KIMI_CODING_API_KEY ?? "sk-test-key",
    });

    const result = await provider.coding.v1.search({
      text_query: "Rust programming language",
      limit: 1,
      enable_page_crawling: true,
    });

    expect(result.search_results).toBeDefined();
    expect(result.search_results.length).toBeGreaterThan(0);

    const first = result.search_results[0];
    expect(first.title).toBeTruthy();
    expect(first.url).toBeTruthy();
  });
});
