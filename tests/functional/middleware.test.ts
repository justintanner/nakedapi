// Tests for middleware functions — pure HOFs, no API calls
// Uses simple async functions (not real providers) to test retry/fallback logic
import { describe, it, expect } from "vitest";
import {
  withRetry,
  withFallback,
  withStreamRetry,
  withStreamFallback,
} from "../../packages/provider/kimicoding/src/middleware";

describe("withRetry", () => {
  it("returns result on first success", async () => {
    const fn = async (x: number) => x * 2;
    const retried = withRetry(fn, { retries: 2, baseMs: 1, jitter: false });
    expect(await retried(5)).toBe(10);
  });

  it("retries on transient error and succeeds", async () => {
    let calls = 0;
    const fn = async () => {
      calls++;
      if (calls < 3) throw Object.assign(new Error("fail"), { status: 500 });
      return "ok";
    };
    const retried = withRetry(fn, { retries: 3, baseMs: 1, jitter: false });
    expect(await retried(null)).toBe("ok");
    expect(calls).toBe(3);
  });

  it("throws after exhausting retries", async () => {
    const fn = async () => {
      throw Object.assign(new Error("always fail"), { status: 500 });
    };
    const retried = withRetry(fn, { retries: 2, baseMs: 1, jitter: false });
    await expect(retried(null)).rejects.toThrow("always fail");
  });

  it("does not retry non-transient errors (4xx)", async () => {
    let calls = 0;
    const fn = async () => {
      calls++;
      throw Object.assign(new Error("bad request"), { status: 400 });
    };
    const retried = withRetry(fn, { retries: 3, baseMs: 1, jitter: false });
    await expect(retried(null)).rejects.toThrow("bad request");
    expect(calls).toBe(1);
  });

  it("treats 429 as transient", async () => {
    let calls = 0;
    const fn = async () => {
      calls++;
      if (calls < 2) throw Object.assign(new Error("rate"), { status: 429 });
      return "ok";
    };
    const retried = withRetry(fn, { retries: 2, baseMs: 1, jitter: false });
    expect(await retried(null)).toBe("ok");
    expect(calls).toBe(2);
  });

  it("passes request and signal through", async () => {
    const fn = async (req: string, signal?: AbortSignal) => {
      return `${req}-${signal ? "has-signal" : "no-signal"}`;
    };
    const retried = withRetry(fn);
    const controller = new AbortController();
    expect(await retried("hello", controller.signal)).toBe("hello-has-signal");
  });
});

describe("withFallback", () => {
  it("returns result from first function on success", async () => {
    const fn1 = async () => "primary";
    const fn2 = async () => "secondary";
    const fb = withFallback([fn1, fn2]);
    expect(await fb(null)).toBe("primary");
  });

  it("falls back to second function on first failure", async () => {
    const fn1 = async () => {
      throw new Error("primary down");
    };
    const fn2 = async () => "secondary";
    const fb = withFallback([fn1, fn2]);
    expect(await fb(null)).toBe("secondary");
  });

  it("throws last error when all functions fail", async () => {
    const fn1 = async () => {
      throw new Error("first");
    };
    const fn2 = async () => {
      throw new Error("second");
    };
    const fb = withFallback([fn1, fn2]);
    await expect(fb(null)).rejects.toThrow("second");
  });

  it("calls onFallback callback on each failure", async () => {
    const errors: Array<{ error: unknown; index: number }> = [];
    const fn1 = async () => {
      throw new Error("fail1");
    };
    const fn2 = async () => "ok";
    const fb = withFallback([fn1, fn2], {
      onFallback: (error, index) => errors.push({ error, index }),
    });
    await fb(null);
    expect(errors).toHaveLength(1);
    expect(errors[0].index).toBe(0);
  });

  it("throws if given empty array", () => {
    expect(() => withFallback([])).toThrow(
      "withFallback requires at least one function"
    );
  });
});

describe("withStreamRetry", () => {
  it("yields chunks on success", async () => {
    async function* gen() {
      yield "a";
      yield "b";
    }
    const retried = withStreamRetry(gen, {
      retries: 2,
      baseMs: 1,
      jitter: false,
    });
    const chunks: string[] = [];
    for await (const c of retried(null)) {
      chunks.push(c);
    }
    expect(chunks).toEqual(["a", "b"]);
  });

  it("retries generator on transient error", async () => {
    let calls = 0;
    async function* gen() {
      calls++;
      if (calls < 2) throw Object.assign(new Error("fail"), { status: 500 });
      yield "recovered";
    }
    const retried = withStreamRetry(gen, {
      retries: 2,
      baseMs: 1,
      jitter: false,
    });
    const chunks: string[] = [];
    for await (const c of retried(null)) {
      chunks.push(c);
    }
    expect(chunks).toEqual(["recovered"]);
    expect(calls).toBe(2);
  });

  it("throws after exhausting retries", async () => {
    // eslint-disable-next-line require-yield
    async function* gen(): AsyncGenerator<string> {
      throw Object.assign(new Error("fail"), { status: 500 });
    }
    const retried = withStreamRetry(gen, {
      retries: 1,
      baseMs: 1,
      jitter: false,
    });
    const chunks: string[] = [];
    await expect(async () => {
      for await (const c of retried(null)) {
        chunks.push(c);
      }
    }).rejects.toThrow("fail");
  });
});

describe("withStreamFallback", () => {
  it("yields from first generator on success", async () => {
    async function* gen1() {
      yield "primary";
    }
    async function* gen2() {
      yield "secondary";
    }
    const fb = withStreamFallback([gen1, gen2]);
    const chunks: string[] = [];
    for await (const c of fb(null)) {
      chunks.push(c);
    }
    expect(chunks).toEqual(["primary"]);
  });

  it("falls back to second generator", async () => {
    // eslint-disable-next-line require-yield
    async function* gen1(): AsyncGenerator<string> {
      throw new Error("fail");
    }
    async function* gen2() {
      yield "fallback";
    }
    const fb = withStreamFallback([gen1, gen2]);
    const chunks: string[] = [];
    for await (const c of fb(null)) {
      chunks.push(c);
    }
    expect(chunks).toEqual(["fallback"]);
  });

  it("throws if given empty array", () => {
    expect(() => withStreamFallback([])).toThrow(
      "withStreamFallback requires at least one function"
    );
  });
});
