# @nakedapi/xai

[![npm](https://img.shields.io/npm/v/@nakedapi/xai?color=cb0000)](https://www.npmjs.com/package/@nakedapi/xai)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

xAI (Grok) provider — responses API, chat completions, image/video generation and editing, file management, batches, collections, document search, and model listing. Completely standalone with zero external dependencies.

## Installation

```bash
npm install @nakedapi/xai
# or
pnpm add @nakedapi/xai
```

## Quick Start

```typescript
import { xai as createXai } from "@nakedapi/xai";

const xai = createXai({ apiKey: process.env.XAI_API_KEY! });

const response = await xai.post.v1.chat.completions({
  model: "grok-4-fast",
  messages: [{ role: "user", content: "Hello!" }],
});
```

## API Surface

The xAI provider uses a verb-prefix pattern that mirrors HTTP methods:

```
xai.<verb>.v1.<path.in.camelCase>(params)
```

Every call reads like an HTTP request. The path after the verb IS the URL path, segment-by-segment, with kebab-case converted to camelCase.

### POST Endpoints

Base URL: `https://api.x.ai/v1`

| URL                                            | Method Signature                                          |
| ---------------------------------------------- | --------------------------------------------------------- |
| `POST /v1/responses`                           | `xai.post.v1.responses(req)`                              |
| `POST /v1/chat/completions`                    | `xai.post.v1.chat.completions(req)`                       |
| `POST /v1/images/generations`                  | `xai.post.v1.images.generations(req)`                     |
| `POST /v1/images/edits`                        | `xai.post.v1.images.edits(req)`                           |
| `POST /v1/videos/generations`                  | `xai.post.v1.videos.generations(req)`                     |
| `POST /v1/videos/edits`                        | `xai.post.v1.videos.edits(req)`                           |
| `POST /v1/videos/extensions`                   | `xai.post.v1.videos.extensions(req)`                      |
| `POST /v1/files`                               | `xai.post.v1.files(file, filename, purpose?)`             |
| `POST /v1/batches`                             | `xai.post.v1.batches(req)`                                |
| `POST /v1/batches/{id}:cancel`                 | `xai.post.v1.batches.cancel(id)`                          |
| `POST /v1/batches/{id}/requests`               | `xai.post.v1.batches.requests(id, req)`                   |
| `POST /v1/collections`                         | `xai.post.v1.collections(req)`                            |
| `POST /v1/collections/{id}/documents/{fileId}` | `xai.post.v1.collections.documents(collId, fileId, req?)` |
| `POST /v1/documents/search`                    | `xai.post.v1.documents.search(req)`                       |
| `POST /v1/tokenize-text`                       | `xai.post.v1.tokenizeText(req)`                           |
| `POST /v1/realtime/client_secrets`             | `xai.post.v1.realtime.clientSecrets(req)`                 |
| `POST /v1/auth/teams/{teamId}/api-keys`        | `xai.post.v1.auth.apiKeys(teamId, req)`                   |
| `POST /v1/auth/api-keys/{id}/rotate`           | `xai.post.v1.auth.apiKeys.rotate(id)`                     |

### GET Endpoints

| URL                                            | Method Signature                                             |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `GET /v1/responses/{id}`                       | `xai.get.v1.responses(id)`                                   |
| `GET /v1/chat/deferred-completion/{requestId}` | `xai.get.v1.chat.deferredCompletion(requestId)`              |
| `GET /v1/videos/{requestId}`                   | `xai.get.v1.videos(requestId)`                               |
| `GET /v1/files`                                | `xai.get.v1.files()`                                         |
| `GET /v1/files/{fileId}`                       | `xai.get.v1.files(fileId)`                                   |
| `GET /v1/models`                               | `xai.get.v1.models()`                                        |
| `GET /v1/models/{modelId}`                     | `xai.get.v1.models(modelId)`                                 |
| `GET /v1/language-models`                      | `xai.get.v1.languageModels()`                                |
| `GET /v1/language-models/{modelId}`            | `xai.get.v1.languageModels(modelId)`                         |
| `GET /v1/image-generation-models`              | `xai.get.v1.imageGenerationModels()`                         |
| `GET /v1/image-generation-models/{modelId}`    | `xai.get.v1.imageGenerationModels(modelId)`                  |
| `GET /v1/video-generation-models`              | `xai.get.v1.videoGenerationModels()`                         |
| `GET /v1/video-generation-models/{modelId}`    | `xai.get.v1.videoGenerationModels(modelId)`                  |
| `GET /v1/batches`                              | `xai.get.v1.batches()`                                       |
| `GET /v1/batches/{id}`                         | `xai.get.v1.batches(id)`                                     |
| `GET /v1/batches/{id}/requests`                | `xai.get.v1.batches.requests(id)`                            |
| `GET /v1/batches/{id}/results`                 | `xai.get.v1.batches.results(id)`                             |
| `GET /v1/collections`                          | `xai.get.v1.collections()`                                   |
| `GET /v1/collections/{id}`                     | `xai.get.v1.collections(id)`                                 |
| `GET /v1/collections/{id}/documents`           | `xai.get.v1.collections.documents(collId)`                   |
| `GET /v1/collections/{id}/documents/{fileId}`  | `xai.get.v1.collections.documents(collId, fileId)`           |
| `GET /v1/collections/{id}/documents:batchGet`  | `xai.get.v1.collections.documents.batchGet(collId, fileIds)` |
| `GET /v1/auth/teams/{teamId}/api-keys`         | `xai.get.v1.auth.apiKeys(teamId)`                            |
| `GET /v1/auth/api-keys/{id}/propagation`       | `xai.get.v1.auth.apiKeys.propagation(apiKeyId)`              |
| `GET /v1/auth/teams/{teamId}/models`           | `xai.get.v1.auth.teams.models(teamId)`                       |
| `GET /v1/auth/teams/{teamId}/endpoints`        | `xai.get.v1.auth.teams.endpoints(teamId)`                    |
| `GET /v1/auth/management-keys/validation`      | `xai.get.v1.auth.managementKeys.validation()`                |

### DELETE Endpoints

| URL                                              | Method Signature                                      |
| ------------------------------------------------ | ----------------------------------------------------- |
| `DELETE /v1/responses/{id}`                      | `xai.delete.v1.responses(id)`                         |
| `DELETE /v1/files/{fileId}`                      | `xai.delete.v1.files(fileId)`                         |
| `DELETE /v1/collections/{id}`                    | `xai.delete.v1.collections(id)`                       |
| `DELETE /v1/collections/{id}/documents/{fileId}` | `xai.delete.v1.collections.documents(collId, fileId)` |
| `DELETE /v1/auth/api-keys/{id}`                  | `xai.delete.v1.auth.apiKeys(apiKeyId)`                |

### PUT Endpoints

| URL                          | Method Signature                         |
| ---------------------------- | ---------------------------------------- |
| `PUT /v1/collections/{id}`   | `xai.put.v1.collections(id, req)`        |
| `PUT /v1/auth/api-keys/{id}` | `xai.put.v1.auth.apiKeys(apiKeyId, req)` |

### PATCH Endpoints

| URL                                             | Method Signature                                     |
| ----------------------------------------------- | ---------------------------------------------------- |
| `PATCH /v1/collections/{id}/documents/{fileId}` | `xai.patch.v1.collections.documents(collId, fileId)` |

### WebSocket

| URL               | Method Signature            |
| ----------------- | --------------------------- |
| `WS /v1/realtime` | `xai.ws.v1.realtime(opts?)` |

## Usage Examples

### Responses API

```typescript
// Create a response
const response = await xai.post.v1.responses({
  model: "grok-4-fast",
  input: "What is the capital of France?",
});

// With web search
const searched = await xai.post.v1.responses({
  model: "grok-4-fast",
  input: "Latest TypeScript news",
  tools: [{ type: "web_search" }],
  search_parameters: { mode: "auto" },
});

// Retrieve a stored response
const saved = await xai.get.v1.responses(response.id);

// Delete a response
await xai.delete.v1.responses(response.id);
```

### Chat Completions

```typescript
const response = await xai.post.v1.chat.completions({
  model: "grok-4-fast",
  messages: [{ role: "user", content: "Hello!" }],
});

// Check deferred completion status
const deferred = await xai.get.v1.chat.deferredCompletion(requestId);
```

### Image Generation

```typescript
const response = await xai.post.v1.images.generations({
  model: "grok-imagine-image",
  prompt: "A futuristic cityscape",
});
```

### Video Generation

```typescript
const response = await xai.post.v1.videos.generations({
  model: "grok-imagine-video",
  prompt: "A timelapse of a sunset",
});
// Poll for completion
const result = await xai.get.v1.videos(response.request_id);
```

### File Management

```typescript
// Upload a file
const file = new Blob([buffer], { type: "application/jsonl" });
const uploaded = await xai.post.v1.files(file, "data.jsonl", "batch");

// List files
const files = await xai.get.v1.files();

// Get a specific file
const fileInfo = await xai.get.v1.files("file-id");

// Delete a file
await xai.delete.v1.files("file-id");
```

### Batches

```typescript
// Create a batch
const batch = await xai.post.v1.batches({ name: "My Batch" });

// List batches
const batches = await xai.get.v1.batches();

// Get a specific batch
const batchInfo = await xai.get.v1.batches(batch.batch_id);

// Cancel a batch
const cancelled = await xai.post.v1.batches.cancel(batch.batch_id);

// Add requests to a batch
await xai.post.v1.batches.requests(batch.batch_id, {
  batch_requests: [
    {
      batch_request_id: "req-1",
      batch_request: {
        chat_get_completion: {
          messages: [{ role: "user", content: "Hello" }],
          model: "grok-3",
        },
      },
    },
  ],
});

// List batch requests
const requests = await xai.get.v1.batches.requests(batch.batch_id);

// Get batch results
const results = await xai.get.v1.batches.results(batch.batch_id);
```

### Collections & Documents

```typescript
// Create a collection
const collection = await xai.post.v1.collections({
  collection_name: "My Collection",
});

// List collections
const collections = await xai.get.v1.collections();

// Get a specific collection
const collInfo = await xai.get.v1.collections(collection.collection_id);

// Update a collection
const updated = await xai.put.v1.collections(collection.collection_id, {
  collection_name: "Updated Name",
});

// Delete a collection
await xai.delete.v1.collections(collection.collection_id);

// Add document to collection
await xai.post.v1.collections.documents(collection.collection_id, fileId);

// List documents in collection
const docs = await xai.get.v1.collections.documents(collection.collection_id);

// Get a specific document
const doc = await xai.get.v1.collections.documents(
  collection.collection_id,
  fileId
);

// Delete a document
await xai.delete.v1.collections.documents(collection.collection_id, fileId);

// Regenerate a document (PATCH)
await xai.patch.v1.collections.documents(collection.collection_id, fileId);

// Batch get documents
const batchDocs = await xai.get.v1.collections.documents.batchGet(
  collection.collection_id,
  [fileId1, fileId2]
);
```

### Document Search

```typescript
const results = await xai.post.v1.documents.search({
  query: "latest TypeScript news",
  source: { collection_ids: ["your-collection-id"] },
});
```

### Realtime WebSocket

```typescript
// Create client secret
const secret = await xai.post.v1.realtime.clientSecrets({
  expires_after: { seconds: 600 },
});

// Connect to WebSocket
const connection = xai.ws.v1.realtime({ token: secret.value });

// Send events
connection.send({ type: "session.update", session: { ... } });

// Receive events
for await (const event of connection) {
  console.log(event);
}
```

### Auth (Management API)

```typescript
// Create API key
const apiKey = await xai.post.v1.auth.apiKeys(teamId, {
  name: "My API Key",
  acls: ["api-key:endpoint:*"],
});

// List API keys
const keys = await xai.get.v1.auth.apiKeys(teamId);

// Update API key
const updated = await xai.put.v1.auth.apiKeys(apiKey.apiKeyId, {
  apiKey: { name: "Updated Name" },
  fieldMask: "name",
});

// Rotate API key
const rotated = await xai.post.v1.auth.apiKeys.rotate(apiKey.apiKeyId);

// Delete API key
await xai.delete.v1.auth.apiKeys(apiKey.apiKeyId);

// Check API key propagation
const propagation = await xai.get.v1.auth.apiKeys.propagation(apiKey.apiKeyId);

// Get team models
const models = await xai.get.v1.auth.teams.models(teamId);

// Get team endpoints
const endpoints = await xai.get.v1.auth.teams.endpoints(teamId);

// Validate management key
const validation = await xai.get.v1.auth.managementKeys.validation();
```

## Payload Validation

All POST, PUT, and PATCH endpoints expose `payloadSchema` and `validatePayload` for runtime validation:

```typescript
// Access the schema
const schema = xai.post.v1.chat.completions.payloadSchema;
console.log(schema.method); // "POST"
console.log(schema.path); // "/chat/completions"

// Validate before sending
const result = xai.post.v1.chat.completions.validatePayload({
  model: "grok-4-fast",
  messages: [{ role: "user", content: "Hello" }],
});

if (!result.valid) {
  console.error(result.errors);
}
```

## Configuration

```typescript
const xai = createXai({
  apiKey: "your-api-key", // required
  baseURL: "https://...", // optional, custom base URL
  managementApiKey: "mgmt-key", // optional, for management API
  managementBaseURL: "https://...", // optional, for management API
  timeout: 30000, // optional, ms (default: 30000)
  fetch: customFetch, // optional, custom fetch implementation
});
```

## Middleware

```typescript
import { xai as createXai, withRetry, withFallback } from "@nakedapi/xai";

const xai = createXai({ apiKey: process.env.XAI_API_KEY! });
const chat = withRetry(xai.post.v1.chat.completions, { retries: 3 });
```

## License

MIT
