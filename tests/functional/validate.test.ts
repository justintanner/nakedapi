// Tests for validatePayload — pure function, no API calls
// All providers share the same validation engine; testing via kimicoding's export
import { describe, it, expect } from "vitest";
import { validatePayload } from "../../packages/provider/kimicoding/src/validate";
import type { PayloadSchema } from "../../packages/provider/kimicoding/src/types";

const testSchema: PayloadSchema = {
  method: "POST",
  path: "/test",
  contentType: "application/json",
  fields: {
    name: { type: "string", required: true },
    count: { type: "number" },
    active: { type: "boolean" },
    role: { type: "string", enum: ["admin", "user", "guest"] as const },
    tags: {
      type: "array",
      items: { type: "string" },
    },
    metadata: {
      type: "object",
      properties: {
        key: { type: "string", required: true },
        value: { type: "string" },
      },
    },
    items: {
      type: "array",
      required: true,
      items: {
        type: "object",
        properties: {
          id: { type: "number", required: true },
          label: { type: "string" },
        },
      },
    },
  },
};

describe("validatePayload", () => {
  it("accepts valid payload with all required fields", () => {
    const result = validatePayload(
      { name: "test", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("accepts valid payload with all fields", () => {
    const result = validatePayload(
      {
        name: "test",
        count: 5,
        active: true,
        role: "admin",
        tags: ["a", "b"],
        metadata: { key: "k", value: "v" },
        items: [{ id: 1, label: "first" }],
      },
      testSchema
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects missing required fields", () => {
    const result = validatePayload({}, testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("name is required");
    expect(result.errors).toContain("items is required");
  });

  it("rejects wrong type for string field", () => {
    const result = validatePayload(
      { name: 123, items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("name must be of type string");
  });

  it("rejects wrong type for number field", () => {
    const result = validatePayload(
      { name: "x", count: "five", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("count must be of type number");
  });

  it("rejects wrong type for boolean field", () => {
    const result = validatePayload(
      { name: "x", active: "yes", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("active must be of type boolean");
  });

  it("rejects invalid enum value", () => {
    const result = validatePayload(
      { name: "x", role: "superadmin", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("must be one of");
    expect(result.errors[0]).toContain("admin");
  });

  it("accepts valid enum value", () => {
    const result = validatePayload(
      { name: "x", role: "guest", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(true);
  });

  it("rejects non-array for array field", () => {
    const result = validatePayload(
      { name: "x", tags: "not-array", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("tags must be of type array");
  });

  it("validates array item types", () => {
    const result = validatePayload(
      { name: "x", tags: ["ok", 123], items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("tags[1] must be of type string");
  });

  it("rejects non-object for object field", () => {
    const result = validatePayload(
      { name: "x", metadata: "not-object", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("metadata must be of type object");
  });

  it("validates nested object required fields", () => {
    const result = validatePayload(
      { name: "x", metadata: { value: "v" }, items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("metadata.key is required");
  });

  it("validates array of objects with nested required fields", () => {
    const result = validatePayload(
      { name: "x", items: [{ label: "no-id" }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("items[0].id is required");
  });

  it("validates array items that are wrong type", () => {
    const result = validatePayload(
      { name: "x", items: ["not-object"] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("items[0] must be of type object");
  });

  it("rejects null payload", () => {
    const result = validatePayload(null, testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("payload must be a non-null object");
  });

  it("rejects array payload", () => {
    const result = validatePayload([], testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("payload must be a non-null object");
  });

  it("rejects string payload", () => {
    const result = validatePayload("hello", testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("payload must be a non-null object");
  });

  it("skips validation for undefined optional fields", () => {
    const result = validatePayload(
      { name: "x", items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(true);
  });

  it("skips validation for null optional fields", () => {
    const result = validatePayload(
      { name: "x", count: null, items: [{ id: 1 }] },
      testSchema
    );
    expect(result.valid).toBe(true);
  });
});
