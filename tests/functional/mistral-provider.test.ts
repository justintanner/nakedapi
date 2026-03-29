import { describe, it, expect } from "vitest";
import { mistral, MistralError } from "@nakedapi/mistral";

describe("mistral provider structure", () => {
  const provider = mistral({ apiKey: "test-key" });

  it("should have v1 namespace", () => {
    expect(provider.v1).toBeDefined();
  });

  it("should have chat.completions method with schema", () => {
    expect(typeof provider.v1.chat.completions).toBe("function");
    expect(provider.v1.chat.completions.payloadSchema).toBeDefined();
    expect(provider.v1.chat.completions.payloadSchema.method).toBe("POST");
    expect(provider.v1.chat.completions.payloadSchema.path).toBe(
      "/chat/completions"
    );
    expect(typeof provider.v1.chat.completions.validatePayload).toBe(
      "function"
    );
  });

  it("should validate chat completions payload", () => {
    const valid = provider.v1.chat.completions.validatePayload({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(valid.valid).toBe(true);
    expect(valid.errors).toHaveLength(0);

    const invalid = provider.v1.chat.completions.validatePayload({});
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it("should have chat.completions.moderations sub-method", () => {
    expect(typeof provider.v1.chat.completions.moderations).toBe("function");
    expect(
      provider.v1.chat.completions.moderations.payloadSchema
    ).toBeDefined();
  });

  it("should have chat.completions.classifications sub-method", () => {
    expect(typeof provider.v1.chat.completions.classifications).toBe(
      "function"
    );
    expect(
      provider.v1.chat.completions.classifications.payloadSchema
    ).toBeDefined();
  });

  it("should have fim.completions method", () => {
    expect(typeof provider.v1.fim.completions).toBe("function");
    expect(provider.v1.fim.completions.payloadSchema.path).toBe(
      "/fim/completions"
    );
  });

  it("should have embeddings method with schema", () => {
    expect(typeof provider.v1.embeddings).toBe("function");
    expect(provider.v1.embeddings.payloadSchema.path).toBe("/embeddings");
  });

  it("should have ocr method with schema", () => {
    expect(typeof provider.v1.ocr).toBe("function");
    expect(provider.v1.ocr.payloadSchema.path).toBe("/ocr");
  });

  it("should have moderations method", () => {
    expect(typeof provider.v1.moderations).toBe("function");
    expect(provider.v1.moderations.payloadSchema.path).toBe("/moderations");
  });

  it("should have classifications method", () => {
    expect(typeof provider.v1.classifications).toBe("function");
    expect(provider.v1.classifications.payloadSchema.path).toBe(
      "/classifications"
    );
  });

  it("should have models namespace", () => {
    expect(typeof provider.v1.models.list).toBe("function");
    expect(typeof provider.v1.models.retrieve).toBe("function");
    expect(typeof provider.v1.models.del).toBe("function");
  });

  it("should have files namespace", () => {
    expect(typeof provider.v1.files.list).toBe("function");
    expect(typeof provider.v1.files.upload).toBe("function");
    expect(typeof provider.v1.files.retrieve).toBe("function");
    expect(typeof provider.v1.files.del).toBe("function");
    expect(typeof provider.v1.files.content).toBe("function");
    expect(typeof provider.v1.files.url).toBe("function");
  });

  it("should have fine_tuning namespace", () => {
    expect(typeof provider.v1.fine_tuning.jobs).toBe("function");
    expect(provider.v1.fine_tuning.jobs.payloadSchema).toBeDefined();
    expect(typeof provider.v1.fine_tuning.jobs.list).toBe("function");
    expect(typeof provider.v1.fine_tuning.jobs.retrieve).toBe("function");
    expect(typeof provider.v1.fine_tuning.jobs.cancel).toBe("function");
    expect(typeof provider.v1.fine_tuning.jobs.start).toBe("function");
    expect(typeof provider.v1.fine_tuning.models.update).toBe("function");
    expect(typeof provider.v1.fine_tuning.models.archive).toBe("function");
    expect(typeof provider.v1.fine_tuning.models.unarchive).toBe("function");
  });

  it("should have batch.jobs namespace", () => {
    expect(typeof provider.v1.batch.jobs).toBe("function");
    expect(provider.v1.batch.jobs.payloadSchema).toBeDefined();
    expect(typeof provider.v1.batch.jobs.list).toBe("function");
    expect(typeof provider.v1.batch.jobs.retrieve).toBe("function");
    expect(typeof provider.v1.batch.jobs.cancel).toBe("function");
  });

  it("should have audio namespace", () => {
    expect(typeof provider.v1.audio.speech).toBe("function");
    expect(provider.v1.audio.speech.payloadSchema).toBeDefined();
    expect(typeof provider.v1.audio.transcriptions).toBe("function");
    expect(provider.v1.audio.transcriptions.payloadSchema).toBeDefined();
    expect(typeof provider.v1.audio.voices.list).toBe("function");
    expect(typeof provider.v1.audio.voices.create).toBe("function");
    expect(typeof provider.v1.audio.voices.retrieve).toBe("function");
    expect(typeof provider.v1.audio.voices.update).toBe("function");
    expect(typeof provider.v1.audio.voices.del).toBe("function");
    expect(typeof provider.v1.audio.voices.sample).toBe("function");
  });

  it("should have agents namespace", () => {
    expect(typeof provider.v1.agents.list).toBe("function");
    expect(typeof provider.v1.agents.create).toBe("function");
    expect(typeof provider.v1.agents.retrieve).toBe("function");
    expect(typeof provider.v1.agents.update).toBe("function");
    expect(typeof provider.v1.agents.del).toBe("function");
    expect(typeof provider.v1.agents.versions.list).toBe("function");
    expect(typeof provider.v1.agents.versions.retrieve).toBe("function");
    expect(typeof provider.v1.agents.versions.update).toBe("function");
    expect(typeof provider.v1.agents.aliases.list).toBe("function");
    expect(typeof provider.v1.agents.aliases.create).toBe("function");
    expect(typeof provider.v1.agents.aliases.del).toBe("function");
    expect(typeof provider.v1.agents.completions).toBe("function");
    expect(provider.v1.agents.completions.payloadSchema).toBeDefined();
  });

  it("should have conversations namespace", () => {
    expect(typeof provider.v1.conversations.list).toBe("function");
    expect(typeof provider.v1.conversations.create).toBe("function");
    expect(typeof provider.v1.conversations.retrieve).toBe("function");
    expect(typeof provider.v1.conversations.del).toBe("function");
    expect(typeof provider.v1.conversations.append).toBe("function");
    expect(typeof provider.v1.conversations.history).toBe("function");
    expect(typeof provider.v1.conversations.messages).toBe("function");
    expect(typeof provider.v1.conversations.restart).toBe("function");
  });

  it("should have libraries namespace", () => {
    expect(typeof provider.v1.libraries.list).toBe("function");
    expect(typeof provider.v1.libraries.create).toBe("function");
    expect(typeof provider.v1.libraries.retrieve).toBe("function");
    expect(typeof provider.v1.libraries.update).toBe("function");
    expect(typeof provider.v1.libraries.del).toBe("function");
    expect(typeof provider.v1.libraries.share.list).toBe("function");
    expect(typeof provider.v1.libraries.share.create).toBe("function");
    expect(typeof provider.v1.libraries.share.del).toBe("function");
    expect(typeof provider.v1.libraries.documents.list).toBe("function");
    expect(typeof provider.v1.libraries.documents.upload).toBe("function");
    expect(typeof provider.v1.libraries.documents.retrieve).toBe("function");
    expect(typeof provider.v1.libraries.documents.update).toBe("function");
    expect(typeof provider.v1.libraries.documents.del).toBe("function");
    expect(typeof provider.v1.libraries.documents.textContent).toBe("function");
    expect(typeof provider.v1.libraries.documents.status).toBe("function");
    expect(typeof provider.v1.libraries.documents.signedUrl).toBe("function");
    expect(typeof provider.v1.libraries.documents.extractedTextSignedUrl).toBe(
      "function"
    );
    expect(typeof provider.v1.libraries.documents.reprocess).toBe("function");
  });

  it("should have correct default baseURL", () => {
    // Verify MistralError is exported
    const error = new MistralError("test", 400);
    expect(error.status).toBe(400);
    expect(error.name).toBe("MistralError");
  });
});
