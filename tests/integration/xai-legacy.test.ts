import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai } from "@nakedapi/xai";

describe("xai legacy endpoints", () => {
  function createProvider() {
    return xai({ apiKey: process.env.XAI_API_KEY ?? "sk-test-key" });
  }

  describe("POST /v1/completions", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/completions");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should complete a text prompt", async () => {
      const provider = createProvider();
      const result = await provider.v1.completions({
        model: "grok-3-fast",
        prompt: "The capital of France is",
        max_tokens: 32,
        temperature: 0,
      });
      expect(result.id).toBeTruthy();
      expect(result.object).toBe("text_completion");
      expect(result.choices.length).toBeGreaterThan(0);
      expect(result.choices[0].text).toBeTruthy();
      expect(result.usage?.total_tokens).toBeGreaterThan(0);
    });
  });

  describe("POST /v1/messages", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/messages");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a message", async () => {
      const provider = createProvider();
      const result = await provider.v1.messages({
        model: "grok-3-fast",
        messages: [{ role: "user", content: "Say hello in one word." }],
        max_tokens: 32,
        temperature: 0,
      });
      expect(result.id).toBeTruthy();
      expect(result.type).toBe("message");
      expect(result.role).toBe("assistant");
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.usage.input_tokens).toBeGreaterThan(0);
    });
  });

  describe("POST /v1/complete", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/complete");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should complete text", async () => {
      const provider = createProvider();
      const result = await provider.v1.complete({
        model: "grok-3-fast",
        prompt: "\n\nHuman: Say hello.\n\nAssistant:",
        max_tokens_to_sample: 32,
        temperature: 0,
      });
      expect(result.id).toBeTruthy();
      expect(result.type).toBe("completion");
      expect(result.completion).toBeTruthy();
      expect(result.model).toBeTruthy();
    });
  });

  describe("GET /v1/api-key", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/api-key-info");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should retrieve api key information", async () => {
      const provider = createProvider();
      const result = await provider.v1["api-key"]();
      expect(result.api_key_id).toBeTruthy();
      expect(result.name).toBeDefined();
      expect(result.team_id).toBeTruthy();
      expect(result.acls).toBeDefined();
      expect(Array.isArray(result.acls)).toBe(true);
      expect(result.redacted_api_key).toBeTruthy();
      expect(typeof result.api_key_blocked).toBe("boolean");
      expect(typeof result.api_key_disabled).toBe("boolean");
    });
  });

  describe("payload schemas", () => {
    it("should expose completions schema and validate", () => {
      const provider = createProvider();
      const schema = provider.v1.completions.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/completions");

      const valid = provider.v1.completions.validatePayload({
        model: "grok-3-fast",
        prompt: "hello",
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.completions.validatePayload({});
      expect(invalid.valid).toBe(false);
    });

    it("should expose messages schema and validate", () => {
      const provider = createProvider();
      const schema = provider.v1.messages.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/messages");

      const valid = provider.v1.messages.validatePayload({
        model: "grok-3-fast",
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 100,
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.messages.validatePayload({});
      expect(invalid.valid).toBe(false);
    });

    it("should expose complete schema and validate", () => {
      const provider = createProvider();
      const schema = provider.v1.complete.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/complete");

      const valid = provider.v1.complete.validatePayload({
        model: "grok-3-fast",
        prompt: "hello",
        max_tokens_to_sample: 100,
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.complete.validatePayload({});
      expect(invalid.valid).toBe(false);
    });
  });
});
