import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { kimicoding } from "@nakedapi/kimicoding";

describe("kimicoding files integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should upload an image file", async () => {
    ctx = setupPolly("kimicoding/files-upload-image");
    const provider = kimicoding({
      apiKey: process.env.KIMI_CODING_API_KEY ?? "sk-test-key",
    });

    // 1x1 red PNG pixel
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    const pngBytes = Uint8Array.from(atob(pngBase64), (c) => c.charCodeAt(0));
    const file = new Blob([pngBytes], { type: "image/png" });

    const result = await provider.coding.v1.files.upload({
      file,
      purpose: "image",
    });

    expect(result.object).toBe("file");
    expect(result.id).toBeTruthy();
    expect(result.purpose).toBe("image");
    expect(result.bytes).toBeGreaterThan(0);
    expect(result.filename).toBeTruthy();
    expect(typeof result.created_at).toBe("number");
  });
});
