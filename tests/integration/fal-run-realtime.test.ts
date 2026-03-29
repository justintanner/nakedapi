import { describe, it, expect } from "vitest";
import { fal } from "@nakedapi/fal";

describe("fal queue status stream", () => {
  it("should expose queue.status as callable function", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    expect(typeof provider.v1.queue.status).toBe("function");
  });

  it("should expose queue.status.stream as a function", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    expect(typeof provider.v1.queue.status.stream).toBe("function");
  });
});

describe("fal sync run", () => {
  it("should expose run as callable function", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    expect(typeof provider.v1.run).toBe("function");
  });

  it("should expose run payloadSchema", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    expect(provider.v1.run.payloadSchema).toBeDefined();
    expect(provider.v1.run.payloadSchema.method).toBe("POST");
    expect(provider.v1.run.payloadSchema.fields.endpoint_id).toBeDefined();
    expect(provider.v1.run.payloadSchema.fields.endpoint_id.required).toBe(
      true
    );
    expect(provider.v1.run.payloadSchema.fields.input).toBeDefined();
    expect(provider.v1.run.payloadSchema.fields.input.required).toBe(true);
  });

  it("should validate run params — valid", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    const result = provider.v1.run.validatePayload({
      endpoint_id: "fal-ai/flux/schnell",
      input: { prompt: "a cat" },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should validate run params — with optional fields", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    const result = provider.v1.run.validatePayload({
      endpoint_id: "fal-ai/flux/schnell",
      input: { prompt: "a cat" },
      timeout: 60,
      store_io: "true",
      object_lifecycle_preference: "keep",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should validate run params — missing required", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    const result = provider.v1.run.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("endpoint_id is required");
    expect(result.errors).toContain("input is required");
  });

  it("should validate run params — wrong types", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    const result = provider.v1.run.validatePayload({
      endpoint_id: 123,
      input: "not-an-object",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("endpoint_id must be of type string");
    expect(result.errors).toContain("input must be of type object");
  });

  it("should accept custom runBaseURL", () => {
    const provider = fal({
      apiKey: "fal-test-key",
      runBaseURL: "https://custom-run.example.com",
    });
    expect(provider.v1.run).toBeDefined();
  });
});

describe("fal realtime WebSocket", () => {
  it("should expose realtime.connect as a function", () => {
    const provider = fal({ apiKey: "fal-test-key" });
    expect(typeof provider.v1.realtime.connect).toBe("function");
  });

  it("should accept custom realtimeBaseURL", () => {
    const provider = fal({
      apiKey: "fal-test-key",
      realtimeBaseURL: "wss://custom-ws.example.com",
    });
    expect(provider.v1.realtime).toBeDefined();
  });
});
