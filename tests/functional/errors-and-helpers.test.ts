// Tests for error classes and helper functions — pure constructors, no API calls
import { describe, it, expect } from "vitest";
import { OpenAiError } from "../../packages/provider/openai/src/types";
import { XaiError } from "../../packages/provider/xai/src/types";
import { FalError } from "../../packages/provider/fal/src/types";
import { KieError } from "../../packages/provider/kie/src/types";
import { KimiCodingError } from "../../packages/provider/kimicoding/src/types";
import {
  textBlock,
  imageBase64,
  imageUrl,
} from "../../packages/provider/kimicoding/src/kimicoding";

describe("error classes", () => {
  describe("OpenAiError", () => {
    it("sets name, message, status, body, and code", () => {
      const err = new OpenAiError("not found", 404, { detail: "gone" }, "nf");
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe("OpenAiError");
      expect(err.message).toBe("not found");
      expect(err.status).toBe(404);
      expect(err.body).toEqual({ detail: "gone" });
      expect(err.code).toBe("nf");
    });

    it("defaults body to null when omitted", () => {
      const err = new OpenAiError("fail", 500);
      expect(err.body).toBeNull();
      expect(err.code).toBeUndefined();
    });
  });

  describe("XaiError", () => {
    it("sets all properties", () => {
      const err = new XaiError("rate limited", 429, null, "rate_limit");
      expect(err.name).toBe("XaiError");
      expect(err.status).toBe(429);
      expect(err.code).toBe("rate_limit");
    });

    it("defaults body to null", () => {
      const err = new XaiError("fail", 500);
      expect(err.body).toBeNull();
    });
  });

  describe("FalError", () => {
    it("sets all properties including type, request_id, docs_url", () => {
      const err = new FalError(
        "auth failed",
        401,
        "authentication_error",
        "req-123",
        "https://docs.fal.ai",
        { error: "bad key" }
      );
      expect(err.name).toBe("FalError");
      expect(err.message).toBe("auth failed");
      expect(err.status).toBe(401);
      expect(err.type).toBe("authentication_error");
      expect(err.request_id).toBe("req-123");
      expect(err.docs_url).toBe("https://docs.fal.ai");
      expect(err.body).toEqual({ error: "bad key" });
    });

    it("handles optional fields", () => {
      const err = new FalError("fail", 500, "server_error");
      expect(err.request_id).toBeUndefined();
      expect(err.docs_url).toBeUndefined();
      expect(err.body).toBeNull();
    });
  });

  describe("KieError", () => {
    it("sets all properties", () => {
      const err = new KieError("bad request", 400, { msg: "invalid" }, "bad");
      expect(err.name).toBe("KieError");
      expect(err.status).toBe(400);
      expect(err.body).toEqual({ msg: "invalid" });
      expect(err.code).toBe("bad");
    });
  });

  describe("KimiCodingError", () => {
    it("sets name, message, status, body", () => {
      const err = new KimiCodingError("timeout", 408, { detail: "slow" });
      expect(err.name).toBe("KimiCodingError");
      expect(err.message).toBe("timeout");
      expect(err.status).toBe(408);
      expect(err.body).toEqual({ detail: "slow" });
    });

    it("defaults body to null", () => {
      const err = new KimiCodingError("fail", 500);
      expect(err.body).toBeNull();
    });

    it("is instanceof Error", () => {
      const err = new KimiCodingError("x", 500);
      expect(err).toBeInstanceOf(Error);
    });
  });
});

describe("kimicoding content helpers", () => {
  describe("textBlock", () => {
    it("returns text content block", () => {
      expect(textBlock("hello")).toEqual({ type: "text", text: "hello" });
    });

    it("handles empty string", () => {
      expect(textBlock("")).toEqual({ type: "text", text: "" });
    });
  });

  describe("imageBase64", () => {
    it("returns base64 image content block", () => {
      expect(imageBase64("abc123", "image/png")).toEqual({
        type: "image",
        source: { type: "base64", media_type: "image/png", data: "abc123" },
      });
    });

    it("supports all media types", () => {
      for (const mt of [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ] as const) {
        const block = imageBase64("data", mt);
        expect(block.source.media_type).toBe(mt);
      }
    });
  });

  describe("imageUrl", () => {
    it("returns url image content block", () => {
      expect(imageUrl("https://example.com/img.png")).toEqual({
        type: "image",
        source: { type: "url", url: "https://example.com/img.png" },
      });
    });
  });
});
