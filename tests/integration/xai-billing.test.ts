import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai } from "@nakedapi/xai";

describe("xai billing integration", () => {
  const teamId = process.env.XAI_TEAM_ID ?? "test-team-id";

  function createProvider() {
    return xai({
      apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      managementApiKey: process.env.XAI_MANAGEMENT_API_KEY ?? "mgmt-test-key",
    });
  }

  describe("billing info", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-info");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should get billing info", async () => {
      const provider = createProvider();
      const info = await provider.v1.billing.info(teamId);
      expect(info.billingInfo).toBeDefined();
    });
  });

  describe("billing info update", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-info-update");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should update billing info", async () => {
      const provider = createProvider();
      const result = await provider.v1.billing.info.update(teamId, {
        billingInfo: {
          customerName: "Test Corp",
          customerEmail: "billing@test.com",
        },
      });
      expect(result.billingInfo).toBeDefined();
    });
  });

  describe("invoices", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-invoices");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list invoices", async () => {
      const provider = createProvider();
      const invoices = await provider.v1.billing.invoices(teamId);
      expect(invoices.invoices).toBeDefined();
      expect(Array.isArray(invoices.invoices)).toBe(true);
    });
  });

  describe("payment method", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-payment-method");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list payment methods", async () => {
      const provider = createProvider();
      const methods = await provider.v1.billing.paymentMethod(teamId);
      expect(methods.paymentMethods).toBeDefined();
      expect(Array.isArray(methods.paymentMethods)).toBe(true);
    });
  });

  describe("postpaid spending limits", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-spending-limits");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should get spending limits", async () => {
      const provider = createProvider();
      const limits = await provider.v1.billing.postpaid.spendingLimits(teamId);
      expect(limits.spendingLimits).toBeDefined();
    });
  });

  describe("postpaid invoice preview", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-invoice-preview");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should get invoice preview", async () => {
      const provider = createProvider();
      const preview = await provider.v1.billing.postpaid.invoicePreview(teamId);
      expect(preview.invoice).toBeDefined();
    });
  });

  describe("prepaid balance", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-prepaid-balance");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should get prepaid balance", async () => {
      const provider = createProvider();
      const balance = await provider.v1.billing.prepaid.balance(teamId);
      expect(balance.balance).toBeDefined();
    });
  });

  describe("usage", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/billing-usage");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should query usage data", async () => {
      const provider = createProvider();
      const usage = await provider.v1.billing.usage(teamId, {
        timeRange: {
          startTime: "2025-01-01 00:00:00",
          endTime: "2025-01-31 23:59:59",
          timezone: "UTC",
        },
        timeUnit: "DAY",
      });
      expect(usage).toBeDefined();
    });
  });

  describe("payload schemas", () => {
    it("should expose billing info update schema and validate", () => {
      const provider = createProvider();
      const schema = provider.v1.billing.info.update.payloadSchema;
      expect(schema.method).toBe("POST");
      expect(schema.path).toContain("/billing/teams/");

      const valid = provider.v1.billing.info.update.validatePayload({
        billingInfo: { customerName: "Test" },
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.billing.info.update.validatePayload({});
      expect(invalid.valid).toBe(false);
    });

    it("should expose payment method set default schema and validate", () => {
      const provider = createProvider();
      const schema = provider.v1.billing.paymentMethod.setDefault.payloadSchema;
      expect(schema.method).toBe("POST");

      const valid =
        provider.v1.billing.paymentMethod.setDefault.validatePayload({
          paymentMethodId: "pm-123",
        });
      expect(valid.valid).toBe(true);

      const invalid =
        provider.v1.billing.paymentMethod.setDefault.validatePayload({});
      expect(invalid.valid).toBe(false);
    });

    it("should expose spending limits update schema and validate", () => {
      const provider = createProvider();
      const schema =
        provider.v1.billing.postpaid.spendingLimits.update.payloadSchema;
      expect(schema.method).toBe("POST");

      const valid =
        provider.v1.billing.postpaid.spendingLimits.update.validatePayload({
          desiredSoftSpendingLimit: { val: "100000" },
        });
      expect(valid.valid).toBe(true);

      const invalid =
        provider.v1.billing.postpaid.spendingLimits.update.validatePayload({});
      expect(invalid.valid).toBe(false);
    });

    it("should expose prepaid top-up schema and validate", () => {
      const provider = createProvider();
      const schema = provider.v1.billing.prepaid.topUp.payloadSchema;
      expect(schema.method).toBe("POST");

      const valid = provider.v1.billing.prepaid.topUp.validatePayload({
        amount: { val: "5000" },
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.billing.prepaid.topUp.validatePayload({});
      expect(invalid.valid).toBe(false);
    });

    it("should expose usage schema and validate", () => {
      const provider = createProvider();
      const schema = provider.v1.billing.usage.payloadSchema;
      expect(schema.method).toBe("POST");

      const valid = provider.v1.billing.usage.validatePayload({
        timeRange: {
          startTime: "2025-01-01 00:00:00",
          endTime: "2025-01-31 23:59:59",
        },
      });
      expect(valid.valid).toBe(true);

      const invalid = provider.v1.billing.usage.validatePayload({});
      expect(invalid.valid).toBe(false);
    });
  });
});
