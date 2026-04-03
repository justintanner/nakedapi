import { describe, it, expect } from "vitest";

// Error classes
import { OpenAiError } from "../../packages/provider/openai/src/types";
import { KimiCodingError } from "../../packages/provider/kimicoding/src/types";
import { XaiError } from "../../packages/provider/xai/src/types";
import { AnthropicError } from "../../packages/provider/anthropic/src/types";
import { FalError } from "../../packages/provider/fal/src/types";
import { FireworksError } from "../../packages/provider/fireworks/src/types";
import { KieError } from "../../packages/provider/kie/src/types";

describe("Error classes", () => {
  describe("OpenAiError", () => {
    it("should create error with message and status", () => {
      const error = new OpenAiError("Test error", 400);
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(400);
      expect(error.name).toBe("OpenAiError");
    });

    it("should create error with body and code", () => {
      const body = { error: { message: "Detailed error" } };
      const error = new OpenAiError("Test error", 400, body, "ERR_001");
      expect(error.body).toEqual(body);
      expect(error.code).toBe("ERR_001");
    });

    it("should be instanceof Error", () => {
      const error = new OpenAiError("Test", 500);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("KimiCodingError", () => {
    it("should create error with message and status", () => {
      const error = new KimiCodingError("Test error", 401);
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(401);
      expect(error.name).toBe("KimiCodingError");
    });

    it("should be instanceof Error", () => {
      const error = new KimiCodingError("Test", 500);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("XaiError", () => {
    it("should create error with message and status", () => {
      const error = new XaiError("Test error", 403);
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(403);
      expect(error.name).toBe("XaiError");
    });

    it("should create error with body and code", () => {
      const body = { error: "invalid_request" };
      const error = new XaiError("Test", 400, body, "ERR_001");
      expect(error.body).toEqual(body);
      expect(error.code).toBe("ERR_001");
    });
  });

  describe("AnthropicError", () => {
    it("should create error with message and status", () => {
      const error = new AnthropicError("Test error", 429);
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(429);
      expect(error.name).toBe("AnthropicError");
    });

    it("should create error with errorType", () => {
      const error = new AnthropicError(
        "Rate limited",
        429,
        null,
        "rate_limit_error"
      );
      expect(error.errorType).toBe("rate_limit_error");
    });
  });

  describe("FalError", () => {
    it("should create error with message, status and type", () => {
      const error = new FalError("Test error", 500, "server_error");
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(500);
      expect(error.type).toBe("server_error");
      expect(error.name).toBe("FalError");
    });
  });

  describe("FireworksError", () => {
    it("should create error with message and status", () => {
      const error = new FireworksError("Test error", 404);
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(404);
      expect(error.name).toBe("FireworksError");
    });
  });

  describe("KieError", () => {
    it("should create error with message and status", () => {
      const error = new KieError("Test error", 400);
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(400);
      expect(error.name).toBe("KieError");
    });

    it("should create error with body and code", () => {
      const body = { field: "value" };
      const error = new KieError("Test", 400, body, "ERR_001");
      expect(error.body).toEqual(body);
      expect(error.code).toBe("ERR_001");
    });
  });
});
