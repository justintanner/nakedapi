import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { xai } from "@nakedapi/xai";

describe("xai audit integration", () => {
  const teamId = process.env.XAI_TEAM_ID ?? "test-team-id";

  function createProvider() {
    return xai({
      apiKey: process.env.XAI_API_KEY ?? "sk-test-key",
      managementApiKey: process.env.XAI_MANAGEMENT_API_KEY ?? "mgmt-test-key",
    });
  }

  describe("list audit events", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/audit-team-events");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list team audit events", async () => {
      const provider = createProvider();
      const result = await provider.v1.audit.teams.events(teamId);
      expect(result.events).toBeDefined();
      expect(Array.isArray(result.events)).toBe(true);
      if (result.events.length > 0) {
        const event = result.events[0];
        expect(event.eventId).toBeTruthy();
        expect(event.eventTime).toBeTruthy();
        expect(event.description).toBeTruthy();
      }
    });
  });

  describe("list audit events with pagination", () => {
    let ctx: PollyContext;

    beforeEach(() => {
      ctx = setupPolly("xai/audit-team-events-paginated");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list audit events with pageSize", async () => {
      const provider = createProvider();
      const result = await provider.v1.audit.teams.events(teamId, {
        pageSize: 2,
      });
      expect(result.events).toBeDefined();
      expect(Array.isArray(result.events)).toBe(true);
      expect(result.events.length).toBeLessThanOrEqual(2);
    });
  });
});
