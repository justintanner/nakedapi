import { describe, it, expect, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { fireworks } from "@nakedapi/fireworks";
import type {
  FireworksResponseOutputMessage,
  FireworksResponseOutputText,
  FireworksResponseDeleteResponse,
} from "@nakedapi/fireworks";

describe("fireworks responses integration", () => {
  let ctx: PollyContext;

  afterEach(async () => {
    await teardownPolly(ctx);
  });

  it("should create a response with string input", async () => {
    ctx = setupPolly("fireworks/responses-hello");
    const provider = fireworks({
      apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
    });
    const result = await provider.v1.responses({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      input: "Say hello in one sentence.",
      temperature: 0,
      max_output_tokens: 100,
    });
    expect(result.object).toBe("response");
    expect(result.status).toBe("completed");
    expect(result.output.length).toBeGreaterThan(0);
    expect(result.output[0].type).toBe("message");
    expect(result.usage?.total_tokens).toBeGreaterThan(0);
  });

  it("should create a response with instructions", async () => {
    ctx = setupPolly("fireworks/responses-instructions");
    const provider = fireworks({
      apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
    });
    const result = await provider.v1.responses({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      input: "What is 2 + 2?",
      instructions: "You are a math tutor. Always show your work step by step.",
      temperature: 0,
      max_output_tokens: 200,
    });
    expect(result.status).toBe("completed");
    const message = result.output[0] as FireworksResponseOutputMessage;
    expect(message.type).toBe("message");
    expect(message.content.length).toBeGreaterThan(0);
    const text = message.content[0] as FireworksResponseOutputText;
    expect(text.type).toBe("output_text");
    expect(text.text).toBeTruthy();
  });

  it("should create a response with structured output (JSON schema)", async () => {
    ctx = setupPolly("fireworks/responses-structured");
    const provider = fireworks({
      apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
    });
    const result = await provider.v1.responses({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      input: "Extract: The capital of France is Paris.",
      temperature: 0,
      max_output_tokens: 200,
      text: {
        format: {
          type: "json_schema",
          name: "capital_info",
          strict: true,
          schema: {
            type: "object",
            properties: {
              country: { type: "string" },
              capital: { type: "string" },
            },
            required: ["country", "capital"],
            additionalProperties: false,
          },
        },
      },
    });
    expect(result.status).toBe("completed");
    const message = result.output[0] as FireworksResponseOutputMessage;
    const text = message.content[0] as FireworksResponseOutputText;
    const parsed = JSON.parse(text.text);
    expect(parsed.country).toBe("France");
    expect(parsed.capital).toBe("Paris");
  });

  it("should handle function calling round-trip", async () => {
    ctx = setupPolly("fireworks/responses-function-call");
    const provider = fireworks({
      apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
    });

    // Step 1: Send a request that triggers a function call
    const step1 = await provider.v1.responses({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      input: "What is the weather in San Francisco?",
      temperature: 0,
      tools: [
        {
          type: "function",
          name: "get_weather",
          description: "Get the current weather for a location",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string" },
            },
            required: ["location"],
          },
        },
      ],
    });
    expect(step1.status).toBe("completed");
    const fnCall = step1.output.find((o) => o.type === "function_call");
    expect(fnCall).toBeDefined();
    expect(fnCall!.type).toBe("function_call");

    // Step 2: Send function call output back
    const step2 = await provider.v1.responses({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      input: [
        {
          type: "function_call_output",
          call_id: fnCall!.id,
          output: JSON.stringify({ temperature: 65, unit: "F", sky: "foggy" }),
        },
      ],
      previous_response_id: step1.id!,
      tools: [
        {
          type: "function",
          name: "get_weather",
          description: "Get the current weather for a location",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string" },
            },
            required: ["location"],
          },
        },
      ],
    });
    expect(step2.status).toBe("completed");
    const message = step2.output.find((o) => o.type === "message");
    expect(message).toBeDefined();
  });

  it("should retrieve a response by ID", async () => {
    ctx = setupPolly("fireworks/responses-get");
    const provider = fireworks({
      apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
    });

    // Create a stored response
    const created = await provider.v1.responses({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      input: "Say the word 'test' and nothing else.",
      temperature: 0,
      max_output_tokens: 50,
      store: true,
    });
    expect(created.id).toBeTruthy();

    // Retrieve it
    const retrieved = await provider.v1.responses.get(created.id!);
    expect(retrieved.id).toBe(created.id);
    expect(retrieved.object).toBe("response");
    expect(retrieved.status).toBe("completed");
  });

  it("should list responses with pagination", async () => {
    ctx = setupPolly("fireworks/responses-list");
    const provider = fireworks({
      apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
    });

    const result = await provider.v1.responses.list({ limit: 5 });
    expect(result.object).toBe("list");
    expect(Array.isArray(result.data)).toBe(true);
    expect(typeof result.has_more).toBe("boolean");
  });

  it("should delete a stored response by ID", async () => {
    ctx = setupPolly("fireworks/responses-delete");
    const provider = fireworks({
      apiKey: process.env.FIREWORKS_API_KEY ?? "fw-test-key",
    });

    // Create a stored response
    const created = await provider.v1.responses({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      input: "Say the word 'ephemeral' and nothing else.",
      temperature: 0,
      max_output_tokens: 50,
      store: true,
    });
    expect(created.id).toBeTruthy();

    // Delete it
    const deleted: FireworksResponseDeleteResponse =
      await provider.v1.responses.del(created.id!);
    expect(deleted.message).toBeTruthy();
  });

  it("should expose payloadSchema on responses methods", async () => {
    ctx = setupPolly("fireworks/responses-schema");
    const provider = fireworks({ apiKey: "fw-test-key" });
    const createSchema = provider.v1.responses.payloadSchema;
    expect(createSchema.method).toBe("POST");
    expect(createSchema.path).toBe("/responses");

    const deleteSchema = provider.v1.responses.del.payloadSchema;
    expect(deleteSchema.method).toBe("DELETE");
    expect(deleteSchema.path).toBe("/responses/{id}");

    const streamSchema = provider.v1.responses.stream.payloadSchema;
    expect(streamSchema.method).toBe("POST");
    expect(streamSchema.path).toBe("/responses");
  });
});
