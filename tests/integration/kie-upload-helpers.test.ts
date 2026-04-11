import { describe, it, expect, afterEach } from "vitest";
import {
  setupPolly,
  setupPollyForFileUploads,
  teardownPolly,
  type PollyContext,
} from "../harness";
import { kie, submitMediaJob } from "@apicity/kie";

describe("kie helper functions", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  describe("submitMediaJob", () => {
    it("should create task and return taskId", async () => {
      ctx = setupPolly("kie/helpers/submit-media-job");
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      const taskId = await submitMediaJob(provider, {
        model: "grok-imagine/text-to-image",
        input: {
          prompt: "A red apple on a wooden table",
          aspect_ratio: "1:1",
        },
      });

      expect(taskId).toBeTruthy();
      expect(typeof taskId).toBe("string");
      expect(taskId.length).toBeGreaterThan(0);
    });
  });

  describe("upload helpers", () => {
    it("should upload file stream directly and return download URL", async () => {
      ctx = setupPollyForFileUploads("kie/helpers/upload-file");
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      // Create a small test file
      const base64Pixel =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFCcSAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const binaryString = atob(base64Pixel);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const file = new Blob([bytes], { type: "image/png" });

      // Use the direct endpoint instead of helper for consistent replay
      const result = await provider.post.api.fileStreamUpload({
        file,
        filename: "helper-test.png",
        uploadPath: "uploads",
      });

      expect(result.code).toBe(200);
      expect(result.data?.downloadUrl).toBeTruthy();
      expect(result.data?.downloadUrl).toMatch(/^https:\/\//);
    });
  });

  describe("payload validation", () => {
    it("should validate payload schema for createTask", async () => {
      const provider = kie({
        apiKey: "test-key",
      });

      // Valid payload
      const validResult = provider.post.api.v1.jobs.createTask.validatePayload({
        model: "grok-imagine/text-to-image",
        input: {
          prompt: "A test image",
        },
      });
      expect(validResult.valid).toBe(true);

      // Invalid payload (missing required field)
      const invalidResult =
        provider.post.api.v1.jobs.createTask.validatePayload({
          input: {},
        });
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors?.length).toBeGreaterThan(0);
    });

    it("should validate payload schema for file uploads", async () => {
      const provider = kie({
        apiKey: "test-key",
      });

      // Valid payload
      const validResult = provider.post.api.fileStreamUpload.validatePayload({
        file: new Blob(["test"]),
        uploadPath: "uploads",
      });
      expect(validResult.valid).toBe(true);

      // Invalid payload (missing required fields)
      const invalidResult = provider.post.api.fileStreamUpload.validatePayload(
        {}
      );
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors?.length).toBeGreaterThan(0);
    });
  });

  describe("backward compatibility aliases", () => {
    it("should export createTaskOrThrow as alias for submitMediaJob", async () => {
      ctx = setupPolly("kie/helpers/alias-createTaskOrThrow");
      const provider = kie({
        apiKey: process.env.KIE_API_KEY ?? "test-key",
      });

      // Import the alias
      const { createTaskOrThrow } = await import("@apicity/kie");

      const taskId = await createTaskOrThrow(provider, {
        model: "grok-imagine/text-to-image",
        input: {
          prompt: "A blue sky with clouds",
          aspect_ratio: "16:9",
        },
      });

      expect(taskId).toBeTruthy();
      expect(typeof taskId).toBe("string");
    });
  });
});
