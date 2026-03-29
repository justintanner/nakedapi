import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@nakedapi/openai";

describe("openai assistants integration", () => {
  let ctx: PollyContext;

  describe("assistants CRUD", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/assistants-crud");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create, retrieve, update, list, and delete an assistant", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Create an assistant
      const assistant = await provider.v1.assistants({
        model: "gpt-4o",
        name: "Test Math Tutor",
        instructions: "You are a helpful math tutor.",
        tools: [{ type: "code_interpreter" }],
      });

      expect(assistant.id).toBeTruthy();
      expect(assistant.object).toBe("assistant");
      expect(assistant.name).toBe("Test Math Tutor");
      expect(assistant.model).toBe("gpt-4o");
      expect(assistant.tools).toHaveLength(1);
      expect(assistant.tools[0].type).toBe("code_interpreter");

      // Retrieve the assistant
      const retrieved = await provider.v1.assistants.retrieve(assistant.id);
      expect(retrieved.id).toBe(assistant.id);
      expect(retrieved.name).toBe("Test Math Tutor");

      // Update the assistant
      const updated = await provider.v1.assistants.update(assistant.id, {
        name: "Updated Math Tutor",
        instructions: "You are an updated math tutor.",
      });
      expect(updated.id).toBe(assistant.id);
      expect(updated.name).toBe("Updated Math Tutor");

      // List assistants
      const list = await provider.v1.assistants.list({ limit: 5 });
      expect(list.object).toBe("list");
      expect(Array.isArray(list.data)).toBe(true);
      expect(typeof list.has_more).toBe("boolean");

      // Delete the assistant
      const deleted = await provider.v1.assistants.del(assistant.id);
      expect(deleted.id).toBe(assistant.id);
      expect(deleted.object).toBe("assistant.deleted");
      expect(deleted.deleted).toBe(true);
    });
  });

  describe("threads and messages", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/assistants-threads-messages");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create thread, add messages, and manage them", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Create a thread
      const thread = await provider.v1.threads();
      expect(thread.id).toBeTruthy();
      expect(thread.object).toBe("thread");

      // Add a message to the thread
      const message = await provider.v1.threads.messages(thread.id, {
        role: "user",
        content: "What is 2 + 2?",
      });
      expect(message.id).toBeTruthy();
      expect(message.object).toBe("thread.message");
      expect(message.role).toBe("user");
      expect(message.thread_id).toBe(thread.id);

      // List messages
      const messages = await provider.v1.threads.messages.list(thread.id);
      expect(messages.object).toBe("list");
      expect(messages.data.length).toBeGreaterThanOrEqual(1);

      // Retrieve message
      const retrieved = await provider.v1.threads.messages.retrieve(
        thread.id,
        message.id
      );
      expect(retrieved.id).toBe(message.id);

      // Update message metadata
      const updated = await provider.v1.threads.messages.update(
        thread.id,
        message.id,
        { metadata: { reviewed: "true" } }
      );
      expect(updated.id).toBe(message.id);

      // Delete the thread
      const deleted = await provider.v1.threads.del(thread.id);
      expect(deleted.id).toBe(thread.id);
      expect(deleted.object).toBe("thread.deleted");
      expect(deleted.deleted).toBe(true);
    });
  });

  describe("runs", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/assistants-runs");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a run and list runs", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Create assistant for the run
      const assistant = await provider.v1.assistants({
        model: "gpt-4o",
        name: "Run Test Assistant",
        instructions: "Answer math questions briefly.",
      });

      // Create a thread with a message
      const thread = await provider.v1.threads({
        messages: [{ role: "user", content: "What is 3 + 5?" }],
      });

      // Create a run
      const run = await provider.v1.threads.runs(thread.id, {
        assistant_id: assistant.id,
      });
      expect(run.id).toBeTruthy();
      expect(run.object).toBe("thread.run");
      expect(run.thread_id).toBe(thread.id);
      expect(run.assistant_id).toBe(assistant.id);
      expect(run.status).toBeTruthy();

      // List runs
      const runs = await provider.v1.threads.runs.list(thread.id);
      expect(runs.object).toBe("list");
      expect(runs.data.length).toBeGreaterThanOrEqual(1);

      // Retrieve run
      const retrieved = await provider.v1.threads.runs.retrieve(
        thread.id,
        run.id
      );
      expect(retrieved.id).toBe(run.id);

      // Clean up
      await provider.v1.assistants.del(assistant.id);
    });
  });

  describe("create thread and run", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/assistants-create-and-run");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a thread and run in one call", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Create assistant
      const assistant = await provider.v1.assistants({
        model: "gpt-4o",
        name: "Create And Run Test",
        instructions: "Answer briefly.",
      });

      // Create thread and run simultaneously
      const run = await provider.v1.threads.runs.create_and_run({
        assistant_id: assistant.id,
        thread: {
          messages: [{ role: "user", content: "What is 10 - 3?" }],
        },
      });
      expect(run.id).toBeTruthy();
      expect(run.object).toBe("thread.run");
      expect(run.assistant_id).toBe(assistant.id);

      // Clean up
      await provider.v1.assistants.del(assistant.id);
    });
  });

  describe("schema and validation", () => {
    it("should expose payloadSchema on assistants create", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.assistants.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/assistants");
      expect(schema.contentType).toBe("application/json");
      expect(schema.fields.model).toBeDefined();
      expect(schema.fields.model.required).toBe(true);
    });

    it("should validate assistants create - valid", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.assistants.validatePayload({
        model: "gpt-4o",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate assistants create - missing model", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.assistants.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("model is required");
    });

    it("should expose payloadSchema on threads create", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.threads.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/threads");
    });

    it("should expose payloadSchema on runs create", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.threads.runs.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/threads/{thread_id}/runs");
      expect(schema.fields.assistant_id.required).toBe(true);
    });

    it("should validate runs create - missing assistant_id", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.threads.runs.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("assistant_id is required");
    });

    it("should expose payloadSchema on submit_tool_outputs", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.threads.runs.submit_tool_outputs.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.fields.tool_outputs.required).toBe(true);
    });

    it("should expose payloadSchema on create_and_run", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.threads.runs.create_and_run.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/threads/runs");
      expect(schema.fields.assistant_id.required).toBe(true);
    });

    it("should expose payloadSchema on assistants delete", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.assistants.del.payloadSchema;

      expect(schema.method).toBe("DELETE");
      expect(schema.path).toBe("/assistants/{assistant_id}");
    });

    it("should expose payloadSchema on threads messages create", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.threads.messages.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/threads/{thread_id}/messages");
      expect(schema.fields.role.required).toBe(true);
      expect(schema.fields.content.required).toBe(true);
    });

    it("should validate messages create - valid", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.threads.messages.validatePayload({
        role: "user",
        content: "Hello",
      });
      expect(result.valid).toBe(true);
    });

    it("should validate messages create - missing required", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.threads.messages.validatePayload({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("role is required");
      expect(result.errors).toContain("content is required");
    });
  });
});
