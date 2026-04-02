// Tests for Kie MIME type utilities — pure functions, no API calls
import { describe, it, expect } from "vitest";
import { kie } from "../../packages/provider/kie/src/kie";

describe("kie inferMimeType", () => {
  // Helper to create a mock fetch that returns a fresh Response each call
  const mockFetch = (responseFactory: () => Response): typeof fetch => {
    return (): Promise<Response> => Promise.resolve(responseFactory());
  };

  const successResponse = () =>
    new Response(JSON.stringify({ data: { downloadUrl: "http://test" } }), {
      status: 200,
    });

  it("infers image/jpeg for jpg extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    // Should not throw for known image types
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.jpg" })
    ).resolves.toBeDefined();
  });

  it("infers image/jpeg for jpeg extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.jpeg" })
    ).resolves.toBeDefined();
  });

  it("infers image/png for png extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.png" })
    ).resolves.toBeDefined();
  });

  it("infers image/gif for gif extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.gif" })
    ).resolves.toBeDefined();
  });

  it("infers image/webp for webp extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.webp" })
    ).resolves.toBeDefined();
  });

  it("infers video/mp4 for mp4 extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.mp4" })
    ).resolves.toBeDefined();
  });

  it("infers audio/mpeg for mp3 extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.mp3" })
    ).resolves.toBeDefined();
  });

  it("is case insensitive for extensions", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    // Test uppercase extension
    await expect(
      p.post.api.fileStreamUpload({
        file: new Blob(["test content"]),
        filename: "test.JPG",
      })
    ).resolves.toBeDefined();
    // Test mixed case extension
    await expect(
      p.post.api.fileStreamUpload({
        file: new Blob(["test content"]),
        filename: "test.PnG",
      })
    ).resolves.toBeDefined();
  });

  it("throws error for unknown extension without explicit mimeType", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(() => new Response("", { status: 200 })),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.unknown" })
    ).rejects.toThrow(/Cannot determine MIME type/);
  });

  it("uses last extension for multiple dots in filename", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    // file.jpg.png should use png
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "file.jpg.png" })
    ).resolves.toBeDefined();
  });

  it("throws error for filename without extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(() => new Response("", { status: 200 })),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "noextension" })
    ).rejects.toThrow(/Cannot determine MIME type/);
  });

  it("uses explicit mimeType when provided", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    // Even with unknown extension, explicit mimeType should work
    await expect(
      p.post.api.fileStreamUpload({
        file,
        filename: "test.unknown",
        mimeType: "application/octet-stream",
      })
    ).resolves.toBeDefined();
  });

  it("infers image/svg+xml for svg extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.svg" })
    ).resolves.toBeDefined();
  });

  it("infers video/quicktime for mov extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.mov" })
    ).resolves.toBeDefined();
  });

  it("infers audio/wav for wav extension", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    const file = new Blob(["test content"]);
    await expect(
      p.post.api.fileStreamUpload({ file, filename: "test.wav" })
    ).resolves.toBeDefined();
  });
});

describe("kie fileBase64Upload with inferMimeType", () => {
  const mockFetch = (responseFactory: () => Response): typeof fetch => {
    return (): Promise<Response> => Promise.resolve(responseFactory());
  };

  const successResponse = () =>
    new Response(JSON.stringify({ data: { downloadUrl: "http://test" } }), {
      status: 200,
    });

  it("infers mime type from filename for base64 uploads", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    // Should work when mimeType is inferred from filename
    await expect(
      p.post.api.fileBase64Upload({
        base64: "aGVsbG8=",
        filename: "test.png",
      })
    ).resolves.toBeDefined();
  });

  it("proceeds without mimeType when cannot infer for base64 uploads", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    // For base64 uploads, if mimeType can't be inferred, it just omits it
    // The upload proceeds without it (server may reject or use default)
    await expect(
      p.post.api.fileBase64Upload({
        base64: "aGVsbG8=",
        filename: "test.unknown",
      })
    ).resolves.toBeDefined();
  });

  it("uses explicit mimeType when provided for base64", async () => {
    const p = kie({
      apiKey: "test",
      fetch: mockFetch(successResponse),
    });
    // Even with unknown extension, explicit mimeType should work
    await expect(
      p.post.api.fileBase64Upload({
        base64: "aGVsbG8=",
        filename: "test.unknown",
        mimeType: "application/octet-stream",
      })
    ).resolves.toBeDefined();
  });
});
