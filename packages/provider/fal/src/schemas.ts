import type { PayloadSchema } from "./types";

export const pricingEstimateSchema: PayloadSchema = {
  method: "POST",
  path: "/models/pricing/estimate",
  contentType: "application/json",
  fields: {
    estimate_type: {
      type: "string",
      required: true,
      enum: ["historical_api_price", "unit_price"],
      description: "Type of cost estimate",
    },
    endpoints: {
      type: "object",
      required: true,
      description:
        "Map of endpoint IDs to quantity objects ({ call_quantity } or { unit_quantity })",
    },
  },
};

export const deletePayloadsSchema: PayloadSchema = {
  method: "DELETE",
  path: "/models/requests/{request_id}/payloads",
  contentType: "application/json",
  fields: {
    request_id: {
      type: "string",
      required: true,
      description: "Request ID whose payloads to delete",
    },
    idempotency_key: {
      type: "string",
      description: "Optional idempotency key",
    },
  },
};
