import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupPolly, teardownPolly, type PollyContext } from "../harness";
import { openai } from "@nakedapi/openai";

describe("openai vector stores integration", () => {
  let ctx: PollyContext;

  describe("create vector store", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-create");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a vector store", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.vector_stores({ name: "test-store" });

      expect(result.id).toBeDefined();
      expect(result.object).toBe("vector_store");
      expect(result.name).toBe("test-store");
      expect(result.status).toBeDefined();
      expect(result.file_counts).toBeDefined();
      expect(typeof result.file_counts.total).toBe("number");
    });
  });

  describe("list vector stores", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-list");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list vector stores", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const result = await provider.v1.vector_stores.list({ limit: 5 });

      expect(result.object).toBe("list");
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.has_more).toBe("boolean");
    });
  });

  describe("retrieve vector store", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-retrieve");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should retrieve a vector store", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Create then retrieve
      const store = await provider.v1.vector_stores({ name: "retrieve-test" });
      const result = await provider.v1.vector_stores.retrieve(store.id);

      expect(result.id).toBe(store.id);
      expect(result.object).toBe("vector_store");
      expect(result.name).toBe("retrieve-test");
    });
  });

  describe("update vector store", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-update");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should update a vector store", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const store = await provider.v1.vector_stores({ name: "before-update" });
      const result = await provider.v1.vector_stores.update(store.id, {
        name: "after-update",
      });

      expect(result.id).toBe(store.id);
      expect(result.name).toBe("after-update");
    });
  });

  describe("delete vector store", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-delete");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should delete a vector store", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const store = await provider.v1.vector_stores({
        name: "delete-test",
      });
      const result = await provider.v1.vector_stores.del(store.id);

      expect(result.id).toBe(store.id);
      expect(result.object).toBe("vector_store.deleted");
      expect(result.deleted).toBe(true);
    });
  });

  describe("search vector store", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-search");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should search a vector store", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      // Create store, upload a file, add to store, then search
      const content = "The capital of France is Paris. It is a beautiful city.";
      const file = new Blob([content], { type: "text/plain" });
      const uploaded = await provider.v1.files.upload({
        file,
        purpose: "assistants",
      });

      const store = await provider.v1.vector_stores({
        name: "search-test",
        file_ids: [uploaded.id],
      });

      // Wait for processing - in replay mode this is instant
      const result = await provider.v1.vector_stores.search(store.id, {
        query: "What is the capital of France?",
        max_num_results: 5,
      });

      expect(result.object).toBe("vector_store.search_results.page");
      expect(Array.isArray(result.data)).toBe(true);
      expect(Array.isArray(result.search_query)).toBe(true);
      expect(typeof result.has_more).toBe("boolean");
    });
  });

  describe("vector store files - create and list", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-files-create");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create and list vector store files", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const content = "Vector store file test content.";
      const file = new Blob([content], { type: "text/plain" });
      const uploaded = await provider.v1.files.upload({
        file,
        purpose: "assistants",
      });

      const store = await provider.v1.vector_stores({ name: "files-test" });

      const vsFile = await provider.v1.vector_stores.files.create(store.id, {
        file_id: uploaded.id,
      });

      expect(vsFile.id).toBeDefined();
      expect(vsFile.object).toBe("vector_store.file");
      expect(vsFile.vector_store_id).toBe(store.id);

      const files = await provider.v1.vector_stores.files.list(store.id);

      expect(files.object).toBe("list");
      expect(Array.isArray(files.data)).toBe(true);
    });
  });

  describe("vector store files - retrieve", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-files-retrieve");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should retrieve a vector store file", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const content = "Retrieve file test content.";
      const file = new Blob([content], { type: "text/plain" });
      const uploaded = await provider.v1.files.upload({
        file,
        purpose: "assistants",
      });

      const store = await provider.v1.vector_stores({
        name: "retrieve-file-test",
      });

      const vsFile = await provider.v1.vector_stores.files.create(store.id, {
        file_id: uploaded.id,
      });

      const retrieved = await provider.v1.vector_stores.files.retrieve(
        store.id,
        vsFile.id
      );

      expect(retrieved.id).toBe(vsFile.id);
      expect(retrieved.object).toBe("vector_store.file");
    });
  });

  describe("vector store files - delete", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-files-delete");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should delete a vector store file", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const content = "Delete file test content.";
      const file = new Blob([content], { type: "text/plain" });
      const uploaded = await provider.v1.files.upload({
        file,
        purpose: "assistants",
      });

      const store = await provider.v1.vector_stores({
        name: "delete-file-test",
      });

      const vsFile = await provider.v1.vector_stores.files.create(store.id, {
        file_id: uploaded.id,
      });

      const result = await provider.v1.vector_stores.files.del(
        store.id,
        vsFile.id
      );

      expect(result.id).toBe(vsFile.id);
      expect(result.object).toBe("vector_store.file.deleted");
      expect(result.deleted).toBe(true);
    });
  });

  describe("vector store file batches - create and retrieve", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-file-batches-create");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should create a file batch and retrieve it", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const content = "Batch file content.";
      const file = new Blob([content], { type: "text/plain" });
      const uploaded = await provider.v1.files.upload({
        file,
        purpose: "assistants",
      });

      const store = await provider.v1.vector_stores({
        name: "batch-test",
      });

      const batch = await provider.v1.vector_stores.file_batches.create(
        store.id,
        {
          file_ids: [uploaded.id],
        }
      );

      expect(batch.id).toBeDefined();
      expect(batch.object).toBe("vector_store.file_batch");
      expect(batch.vector_store_id).toBe(store.id);
      expect(batch.file_counts).toBeDefined();

      // Retrieve returns a response (API may return vector_store object)
      const retrieved = await provider.v1.vector_stores.file_batches.retrieve(
        store.id,
        batch.id
      );

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBeDefined();
    });
  });

  describe("vector store file batches - list files", () => {
    beforeEach(() => {
      ctx = setupPolly("openai/vector-stores-file-batches-list");
    });

    afterEach(async () => {
      await teardownPolly(ctx);
    });

    it("should list files in a batch", async () => {
      const provider = openai({
        apiKey: process.env.OPENAI_API_KEY ?? "sk-test-key",
      });

      const content = "Batch list file content.";
      const file = new Blob([content], { type: "text/plain" });
      const uploaded = await provider.v1.files.upload({
        file,
        purpose: "assistants",
      });

      const store = await provider.v1.vector_stores({
        name: "batch-list-test",
      });

      const batch = await provider.v1.vector_stores.file_batches.create(
        store.id,
        {
          file_ids: [uploaded.id],
        }
      );

      const files = await provider.v1.vector_stores.file_batches.files(
        store.id,
        batch.id
      );

      expect(files.object).toBe("list");
      expect(Array.isArray(files.data)).toBe(true);
    });
  });

  describe("validation", () => {
    it("should expose payloadSchema on vector_stores create", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.vector_stores.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/vector_stores");
      expect(schema.fields.name).toBeDefined();
      expect(schema.fields.file_ids).toBeDefined();
    });

    it("should validate create payload - valid", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.vector_stores.validatePayload({
        name: "test",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should expose payloadSchema on update", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.vector_stores.update.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/vector_stores/{vector_store_id}");
    });

    it("should expose payloadSchema on del", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.vector_stores.del.payloadSchema;

      expect(schema.method).toBe("DELETE");
      expect(schema.path).toBe("/vector_stores/{vector_store_id}");
    });

    it("should expose payloadSchema on search", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.vector_stores.search.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/vector_stores/{vector_store_id}/search");
      expect(schema.fields.query).toBeDefined();
      expect(schema.fields.query.required).toBe(true);
    });

    it("should validate search payload - valid", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.vector_stores.search.validatePayload({
        query: "test search",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate search payload - missing query", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.vector_stores.search.validatePayload({});

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("query is required");
    });

    it("should expose payloadSchema on files create", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema = provider.v1.vector_stores.files.create.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe("/vector_stores/{vector_store_id}/files");
      expect(schema.fields.file_id.required).toBe(true);
    });

    it("should validate files create payload - valid", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result = provider.v1.vector_stores.files.create.validatePayload({
        file_id: "file-123",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate files create payload - missing file_id", () => {
      const provider = openai({ apiKey: "sk-test" });
      const result =
        provider.v1.vector_stores.files.create.validatePayload({});

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("file_id is required");
    });

    it("should expose payloadSchema on file_batches create", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema =
        provider.v1.vector_stores.file_batches.create.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe(
        "/vector_stores/{vector_store_id}/file_batches"
      );
    });

    it("should expose payloadSchema on file_batches cancel", () => {
      const provider = openai({ apiKey: "sk-test" });
      const schema =
        provider.v1.vector_stores.file_batches.cancel.payloadSchema;

      expect(schema.method).toBe("POST");
      expect(schema.path).toBe(
        "/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel"
      );
    });
  });
});
