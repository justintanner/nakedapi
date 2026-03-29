import { describe, it, expect } from "vitest";
import { cohere } from "@nakedapi/cohere";

describe("cohere schema validation (no API calls)", () => {
  const provider = cohere({ apiKey: "test-key" });

  it("v2.chat schema validation", () => {
    const endpoint = provider.v2.chat;
    expect(endpoint.payloadSchema.path).toBe("/v2/chat");

    expect(
      endpoint.validatePayload({
        model: "command-a-03-2025",
        messages: [{ role: "user", content: "Hi" }],
      }).valid
    ).toBe(true);

    const result = endpoint.validatePayload({ messages: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("model is required");
  });

  it("v2.embed schema validation", () => {
    const endpoint = provider.v2.embed;
    expect(endpoint.payloadSchema.path).toBe("/v2/embed");

    expect(
      endpoint.validatePayload({
        model: "embed-v4.0",
        input_type: "search_document",
      }).valid
    ).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("model is required");
    expect(result.errors).toContain("input_type is required");
  });

  it("v2.rerank schema validation", () => {
    const endpoint = provider.v2.rerank;
    expect(endpoint.payloadSchema.path).toBe("/v2/rerank");

    expect(
      endpoint.validatePayload({
        model: "rerank-v3.5",
        query: "test",
        documents: ["doc"],
      }).valid
    ).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("model is required");
    expect(result.errors).toContain("query is required");
    expect(result.errors).toContain("documents is required");
  });

  it("v1.classify schema validation", () => {
    const endpoint = provider.v1.classify;
    expect(endpoint.payloadSchema.path).toBe("/v1/classify");

    expect(endpoint.validatePayload({ inputs: ["test"] }).valid).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("inputs is required");
  });

  it("v1.summarize schema validation", () => {
    const endpoint = provider.v1.summarize;
    expect(endpoint.payloadSchema.path).toBe("/v1/summarize");

    expect(endpoint.validatePayload({ text: "long text here" }).valid).toBe(
      true
    );

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("text is required");
  });

  it("v1.tokenize schema validation", () => {
    const endpoint = provider.v1.tokenize;
    expect(endpoint.payloadSchema.path).toBe("/v1/tokenize");

    expect(
      endpoint.validatePayload({ text: "Hello", model: "command-r-plus" }).valid
    ).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("text is required");
    expect(result.errors).toContain("model is required");
  });

  it("v1.detokenize schema validation", () => {
    const endpoint = provider.v1.detokenize;
    expect(endpoint.payloadSchema.path).toBe("/v1/detokenize");

    expect(
      endpoint.validatePayload({ tokens: [1, 2], model: "command-r-plus" })
        .valid
    ).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("tokens is required");
    expect(result.errors).toContain("model is required");
  });

  it("connectors.create schema validation", () => {
    const endpoint = provider.v1.connectors.create;
    expect(endpoint.payloadSchema.path).toBe("/v1/connectors");

    expect(
      endpoint.validatePayload({ name: "test", url: "https://example.com" })
        .valid
    ).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("name is required");
    expect(result.errors).toContain("url is required");
  });

  it("connectors.update schema validation", () => {
    const endpoint = provider.v1.connectors.update;
    expect(endpoint.payloadSchema.path).toBe("/v1/connectors/{id}");
    expect(endpoint.payloadSchema.method).toBe("PATCH");
    expect(endpoint.validatePayload({ name: "updated" }).valid).toBe(true);
  });

  it("embed-jobs.create schema validation", () => {
    const endpoint = provider.v1["embed-jobs"].create;
    expect(endpoint.payloadSchema.path).toBe("/v1/embed-jobs");

    expect(
      endpoint.validatePayload({
        model: "embed-english-v3.0",
        dataset_id: "ds-123",
        input_type: "search_document",
      }).valid
    ).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("model is required");
    expect(result.errors).toContain("dataset_id is required");
    expect(result.errors).toContain("input_type is required");
  });

  it("finetuning create schema validation", () => {
    const endpoint = provider.v1.finetuning["finetuned-models"].create;
    expect(endpoint.payloadSchema.path).toBe("/v1/finetuning/finetuned-models");

    expect(
      endpoint.validatePayload({
        name: "my-model",
        settings: {
          base_model: { base_type: "BASE_TYPE_CHAT" },
          dataset_id: "ds-123",
        },
      }).valid
    ).toBe(true);

    const result = endpoint.validatePayload({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("name is required");
    expect(result.errors).toContain("settings is required");
  });

  it("finetuning update schema validation", () => {
    const endpoint = provider.v1.finetuning["finetuned-models"].update;
    expect(endpoint.payloadSchema.path).toBe(
      "/v1/finetuning/finetuned-models/{id}"
    );
    expect(endpoint.payloadSchema.method).toBe("PATCH");
  });

  it("datasets.create schema validation", () => {
    const endpoint = provider.v1.datasets.create;
    expect(endpoint.payloadSchema.path).toBe("/v1/datasets");
    expect(endpoint.payloadSchema.contentType).toBe("multipart/form-data");
  });
});
