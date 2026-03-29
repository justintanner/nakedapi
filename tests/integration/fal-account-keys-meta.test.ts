import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { fal, FalError } from "@nakedapi/fal";

describe("fal account, keys & meta", () => {
  function createProvider() {
    return fal({
      apiKey: process.env.FAL_API_KEY ?? "fal-test-key",
    });
  }

  describe("account billing", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fal/account-billing");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should get billing info with credits expanded", async () => {
      const provider = createProvider();
      const billing = await provider.v1.account.billing({
        expand: ["credits"],
      });
      expect(billing.username).toBeTruthy();
      expect(billing.credits).toBeDefined();
      expect(typeof billing.credits!.current_balance).toBe("number");
      expect(billing.credits!.currency).toBeTruthy();
    });
  });

  describe("account focus", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fal/account-focus");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should request FOCUS report (requires enterprise permissions)", async () => {
      const provider = createProvider();
      try {
        const csv = await provider.v1.account.focus({
          source: "estimate",
        });
        // If permissions are granted, expect CSV text
        expect(typeof csv).toBe("string");
        expect(csv.length).toBeGreaterThan(0);
      } catch (error) {
        // Enterprise-only feature returns 403 without permissions
        expect(error).toBeInstanceOf(FalError);
        expect((error as FalError).status).toBe(403);
      }
    });
  });

  describe("keys list", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fal/keys-list");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list API keys", async () => {
      const provider = createProvider();
      const result = await provider.v1.keys();
      expect(result.keys).toBeDefined();
      expect(Array.isArray(result.keys)).toBe(true);
      expect(typeof result.has_more).toBe("boolean");
      if (result.keys.length > 0) {
        expect(result.keys[0].key_id).toBeTruthy();
        expect(result.keys[0].alias).toBeDefined();
      }
    });
  });

  describe("keys create and delete", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fal/keys-create-and-delete");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create and delete an API key", async () => {
      const provider = createProvider();
      const created = await provider.v1.keys.create({
        alias: "nakedapi-integration-test",
      });
      expect(created.key_id).toBeTruthy();
      expect(created.key_secret).toBeTruthy();
      expect(created.key).toBeTruthy();

      await provider.v1.keys.delete({ key_id: created.key_id });
      // Successful deletion returns without error (204)
    });
  });

  describe("meta", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("fal/meta");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should get platform metadata with webhook IP ranges", async () => {
      const provider = createProvider();
      const meta = await provider.v1.meta();
      expect(meta.webhook_ip_ranges).toBeDefined();
      expect(Array.isArray(meta.webhook_ip_ranges)).toBe(true);
      expect(meta.webhook_ip_ranges.length).toBeGreaterThan(0);
    });
  });

  describe("payload schemas", () => {
    it("should expose namespace methods", () => {
      const provider = createProvider();
      expect(typeof provider.v1.account.billing).toBe("function");
      expect(typeof provider.v1.account.focus).toBe("function");
      expect(typeof provider.v1.keys).toBe("function");
      expect(typeof provider.v1.keys.create).toBe("function");
      expect(typeof provider.v1.keys.delete).toBe("function");
      expect(typeof provider.v1.meta).toBe("function");
    });

    it("should expose keys.create payloadSchema", () => {
      const provider = createProvider();
      const schema = provider.v1.keys.create.payloadSchema;
      expect(schema).toBeDefined();
      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/keys");
      expect(schema.contentType).toBe("application/json");
      expect(schema.fields.alias).toBeDefined();
      expect(schema.fields.alias.required).toBe(true);
    });

    it("should validate keys.create — valid", () => {
      const provider = createProvider();
      const result = provider.v1.keys.create.validatePayload({
        alias: "test-key",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate keys.create — missing required", () => {
      const provider = createProvider();
      const result = provider.v1.keys.create.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("alias is required");
    });

    it("should validate keys.create — wrong type", () => {
      const provider = createProvider();
      const result = provider.v1.keys.create.validatePayload({ alias: 123 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("alias must be of type string");
    });
  });
});
