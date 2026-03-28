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

export const queueSubmitSchema: PayloadSchema = {
  method: "POST",
  path: "/{endpoint_id}",
  contentType: "application/json",
  fields: {
    endpoint_id: {
      type: "string",
      required: true,
      description: "Model endpoint ID (e.g. fal-ai/flux/schnell)",
    },
    input: {
      type: "object",
      required: true,
      description: "Model-specific input payload",
    },
    webhook: {
      type: "string",
      description: "Webhook URL for async notification",
    },
    priority: {
      type: "string",
      enum: ["normal", "low"],
      description: "Queue priority (defaults to normal)",
    },
    timeout: {
      type: "number",
      description: "Server-side request timeout in seconds",
    },
    no_retry: {
      type: "boolean",
      description: "Disable automatic retries",
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
