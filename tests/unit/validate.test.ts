import { describe, it, expect } from "vitest";
import { validatePayload } from "../../packages/provider/openai/src/validate";
import type { PayloadSchema } from "../../packages/provider/openai/src/types";

const testSchema: PayloadSchema = {
  method: "POST",
  path: "/test",
  contentType: "application/json",
  fields: {
    name: { type: "string", required: true },
    age: { type: "number" },
    active: { type: "boolean" },
    role: { type: "string", enum: ["admin", "user", "guest"] },
    tags: { type: "array", items: { type: "string" } },
    address: {
      type: "object",
      properties: {
        street: { type: "string", required: true },
        city: { type: "string", required: true },
        zip: { type: "string" },
      },
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", required: true },
          label: { type: "string", required: true },
        },
      },
    },
  },
};

describe("validatePayload", () => {
  it("should accept a valid payload with required fields", () => {
    const result = validatePayload({ name: "Alice" }, testSchema);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should accept a valid payload with all fields", () => {
    const result = validatePayload(
      {
        name: "Alice",
        age: 30,
        active: true,
        role: "admin",
        tags: ["a", "b"],
        address: { street: "123 Main", city: "NYC", zip: "10001" },
        items: [{ id: 1, label: "first" }],
      },
      testSchema
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should reject null", () => {
    const result = validatePayload(null, testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("payload must be a non-null object");
  });

  it("should reject undefined", () => {
    const result = validatePayload(undefined, testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("payload must be a non-null object");
  });

  it("should reject a string", () => {
    const result = validatePayload("hello", testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("payload must be a non-null object");
  });

  it("should reject an array", () => {
    const result = validatePayload([1, 2, 3], testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("payload must be a non-null object");
  });

  it("should reject missing required fields", () => {
    const result = validatePayload({}, testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("name is required");
  });

  it("should reject wrong type for string field", () => {
    const result = validatePayload({ name: 123 }, testSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("name must be of type string");
  });

  it("should reject wrong type for number field", () => {
    const result = validatePayload(
      { name: "Alice", age: "thirty" },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("age must be of type number");
  });

  it("should reject wrong type for boolean field", () => {
    const result = validatePayload(
      { name: "Alice", active: "yes" },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("active must be of type boolean");
  });

  it("should reject invalid enum value", () => {
    const result = validatePayload(
      { name: "Alice", role: "superadmin" },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("role must be one of: admin, user, guest");
  });

  it("should accept valid enum value", () => {
    const result = validatePayload(
      { name: "Alice", role: "admin" },
      testSchema
    );
    expect(result.valid).toBe(true);
  });

  it("should reject non-array for array field", () => {
    const result = validatePayload(
      { name: "Alice", tags: "not-array" },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("tags must be of type array");
  });

  it("should reject wrong item types in array", () => {
    const result = validatePayload(
      { name: "Alice", tags: [1, 2, 3] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("tags[0] must be of type string");
  });

  it("should reject non-object for object field", () => {
    const result = validatePayload(
      { name: "Alice", address: "123 Main" },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("address must be of type object");
  });

  it("should validate nested object required fields", () => {
    const result = validatePayload(
      { name: "Alice", address: { zip: "10001" } },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("address.street is required");
    expect(result.errors).toContain("address.city is required");
  });

  it("should validate array of objects", () => {
    const result = validatePayload(
      { name: "Alice", items: [{ label: "no-id" }] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("items[0].id is required");
  });

  it("should reject wrong types in array of objects", () => {
    const result = validatePayload(
      { name: "Alice", items: ["not-object"] },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("items[0] must be of type object");
  });

  it("should allow optional fields to be omitted", () => {
    const result = validatePayload({ name: "Alice" }, testSchema);
    expect(result.valid).toBe(true);
  });

  it("should collect multiple errors", () => {
    const result = validatePayload(
      { age: "wrong", role: "invalid" },
      testSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
    expect(result.errors).toContain("name is required");
    expect(result.errors).toContain("age must be of type number");
    expect(result.errors).toContain("role must be one of: admin, user, guest");
  });

  it("should accept empty object for schema with no required fields", () => {
    const noRequiredSchema: PayloadSchema = {
      method: "POST",
      path: "/test",
      contentType: "application/json",
      fields: {
        foo: { type: "string" },
        bar: { type: "number" },
      },
    };
    const result = validatePayload({}, noRequiredSchema);
    expect(result.valid).toBe(true);
  });
});
