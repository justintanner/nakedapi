# @nakedapi/openai

[![npm](https://img.shields.io/npm/v/@nakedapi/openai?color=cb0000)](https://www.npmjs.com/package/@nakedapi/openai)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

OpenAI provider — chat completions, embeddings, image generation/editing, responses, and audio transcription/translation. Completely standalone with zero external dependencies.

## Installation

```bash
npm install @nakedapi/openai
# or
pnpm add @nakedapi/openai
```

## Quick Start

```typescript
import { openai as createOpenai } from "@nakedapi/openai";

const openai = createOpenai({ apiKey: process.env.OPENAI_API_KEY! });

const response = await openai.post.v1.chat.completions({
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(response.content);
```

## API Structure

The provider uses a verb-prefix structure: `openai.<verb>.v1.<path>`

### POST endpoints (`openai.post.v1.*`)

| URL                                                 | Method Signature                                                      |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| `POST /v1/chat/completions`                         | `openai.post.v1.chat.completions(req)`                                |
| `POST /v1/chat/completions/{id}`                    | `openai.post.v1.chat.completions(id, req)` (update)                   |
| `POST /v1/embeddings`                               | `openai.post.v1.embeddings(req)`                                      |
| `POST /v1/audio/speech`                             | `openai.post.v1.audio.speech(req)`                                    |
| `POST /v1/audio/transcriptions`                     | `openai.post.v1.audio.transcriptions(req)`                            |
| `POST /v1/audio/translations`                       | `openai.post.v1.audio.translations(req)`                              |
| `POST /v1/images/generations`                       | `openai.post.v1.images.generations(req)`                              |
| `POST /v1/images/edits`                             | `openai.post.v1.images.edits(req)`                                    |
| `POST /v1/files`                                    | `openai.post.v1.files(req)` (upload)                                  |
| `POST /v1/moderations`                              | `openai.post.v1.moderations(req)`                                     |
| `POST /v1/responses`                                | `openai.post.v1.responses(req)`                                       |
| `POST /v1/responses/compact`                        | `openai.post.v1.responses.compact(req)`                               |
| `POST /v1/responses/input_tokens`                   | `openai.post.v1.responses.inputTokens(req)`                           |
| `POST /v1/responses/{id}/cancel`                    | `openai.post.v1.responses.cancel(id)`                                 |
| `POST /v1/batches`                                  | `openai.post.v1.batches(req)`                                         |
| `POST /v1/batches/{id}/cancel`                      | `openai.post.v1.batches.cancel(id)`                                   |
| `POST /v1/fine_tuning/jobs`                         | `openai.post.v1.fine_tuning.jobs(req)`                                |
| `POST /v1/fine_tuning/jobs/{id}/cancel`             | `openai.post.v1.fine_tuning.jobs.cancel(id)`                          |
| `POST /v1/fine_tuning/jobs/{id}/pause`              | `openai.post.v1.fine_tuning.jobs.pause(id)`                           |
| `POST /v1/fine_tuning/jobs/{id}/resume`             | `openai.post.v1.fine_tuning.jobs.resume(id)`                          |
| `POST /v1/fine_tuning/checkpoints/{id}/permissions` | `openai.post.v1.fine_tuning.checkpoints.permissions(checkpoint, req)` |

### GET endpoints (`openai.get.v1.*`)

| URL                                                | Method Signature                                                       |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| `GET /v1/chat/completions`                         | `openai.get.v1.chat.completions(opts?)` (list)                         |
| `GET /v1/chat/completions/{id}`                    | `openai.get.v1.chat.completions(id)` (retrieve)                        |
| `GET /v1/chat/completions/{id}/messages`           | `openai.get.v1.chat.completionsMessages(id, opts?)`                    |
| `GET /v1/files`                                    | `openai.get.v1.files(opts?)` (list)                                    |
| `GET /v1/files/{id}`                               | `openai.get.v1.files(id)` (retrieve)                                   |
| `GET /v1/files/{id}/content`                       | `openai.get.v1.files.content(id)`                                      |
| `GET /v1/models`                                   | `openai.get.v1.models()` (list)                                        |
| `GET /v1/models/{id}`                              | `openai.get.v1.models(id)` (retrieve)                                  |
| `GET /v1/responses/{id}`                           | `openai.get.v1.responses(id, opts?)`                                   |
| `GET /v1/responses/{id}/input_items`               | `openai.get.v1.responses.inputItems(id, opts?)`                        |
| `GET /v1/batches`                                  | `openai.get.v1.batches(opts?)` (list)                                  |
| `GET /v1/batches/{id}`                             | `openai.get.v1.batches(id)` (retrieve)                                 |
| `GET /v1/fine_tuning/jobs`                         | `openai.get.v1.fine_tuning.jobs(opts?)` (list)                         |
| `GET /v1/fine_tuning/jobs/{id}`                    | `openai.get.v1.fine_tuning.jobs(id)` (retrieve)                        |
| `GET /v1/fine_tuning/jobs/{id}/events`             | `openai.get.v1.fine_tuning.jobs.events(id, opts?)`                     |
| `GET /v1/fine_tuning/jobs/{id}/checkpoints`        | `openai.get.v1.fine_tuning.jobs.checkpoints(id, opts?)`                |
| `GET /v1/fine_tuning/checkpoints/{id}/permissions` | `openai.get.v1.fine_tuning.checkpoints.permissions(checkpoint, opts?)` |

### DELETE endpoints (`openai.delete.v1.*`)

| URL                                                            | Method Signature                                                           |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `DELETE /v1/chat/completions/{id}`                             | `openai.delete.v1.chat.completions(id)`                                    |
| `DELETE /v1/files/{id}`                                        | `openai.delete.v1.files(id)`                                               |
| `DELETE /v1/models/{id}`                                       | `openai.delete.v1.models(id)`                                              |
| `DELETE /v1/responses/{id}`                                    | `openai.delete.v1.responses(id)`                                           |
| `DELETE /v1/fine_tuning/checkpoints/{id}/permissions/{permId}` | `openai.delete.v1.fine_tuning.checkpoints.permissions(checkpoint, permId)` |

## Usage Examples

### Chat Completions

```typescript
const response = await openai.post.v1.chat.completions({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Explain monads in one sentence." }],
});
```

### Embeddings

```typescript
const response = await openai.post.v1.embeddings({
  model: "text-embedding-3-small",
  input: "The food was delicious",
});
console.log(response.data[0].embedding);
```

### Image Generation

```typescript
const response = await openai.post.v1.images.generations({
  model: "dall-e-3",
  prompt: "A white siamese cat",
  size: "1024x1024",
});
console.log(response.data[0].url);
```

### Image Editing

```typescript
const response = await openai.post.v1.images.edits({
  image: new Blob([imageBuffer]),
  prompt: "Add a hat to the cat",
});
```

### Responses API

```typescript
const response = await openai.post.v1.responses({
  model: "gpt-4o",
  input: "What is the capital of France?",
});

// Retrieve a previous response
const saved = await openai.get.v1.responses(response.id);

// Delete a response
await openai.delete.v1.responses(response.id);
```

### Audio Transcription

```typescript
const result = await openai.post.v1.audio.transcriptions({
  file: new Blob([mp3Buffer], { type: "audio/mp3" }),
  model: "gpt-4o-mini-transcribe",
});
console.log(result.text);
```

### Audio Translation

```typescript
const result = await openai.post.v1.audio.translations({
  file: new Blob([audioBuffer], { type: "audio/mp3" }),
  model: "whisper-1",
});
console.log(result.text);
```

### Files

```typescript
// Upload
const file = await openai.post.v1.files({
  file: new Blob([content]),
  purpose: "fine-tune",
});

// List
const files = await openai.get.v1.files();

// Retrieve
const info = await openai.get.v1.files(file.id);

// Delete
await openai.delete.v1.files(file.id);
```

### Stored Completions

```typescript
// Create (with store: true)
const completion = await openai.post.v1.chat.completions({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
  store: true,
});

// List stored completions
const list = await openai.get.v1.chat.completions();

// Retrieve specific completion
const retrieved = await openai.get.v1.chat.completions(completion.id);

// Update metadata
await openai.post.v1.chat.completions(completion.id, {
  metadata: { key: "value" },
});

// Delete
await openai.delete.v1.chat.completions(completion.id);
```

## Payload Validation

All POST and DELETE endpoints expose `.payloadSchema` and `.validatePayload()`:

```typescript
// Access the schema
const schema = openai.post.v1.chat.completions.payloadSchema;
console.log(schema.fields); // Field definitions

// Validate before sending
const result = openai.post.v1.chat.completions.validatePayload({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});

if (!result.valid) {
  console.log(result.errors); // Array of validation error messages
}
```

## Configuration

```typescript
const openai = createOpenai({
  apiKey: "your-api-key", // required
  baseURL: "https://...", // optional, custom base URL
  timeout: 30000, // optional, ms (default: 30000)
  fetch: customFetch, // optional, custom fetch implementation
});
```

## Middleware

```typescript
import {
  openai as createOpenai,
  withRetry,
  withFallback,
} from "@nakedapi/openai";

const openai = createOpenai({ apiKey: process.env.OPENAI_API_KEY! });

// Retry on transient errors (429, 5xx)
const chat = withRetry(openai.post.v1.chat.completions, { retries: 3 });

// Failover across accounts
const primary = createOpenai({ apiKey: process.env.OPENAI_KEY_PRIMARY! });
const backup = createOpenai({ apiKey: process.env.OPENAI_KEY_BACKUP! });
const resilient = withFallback([
  primary.post.v1.chat.completions,
  backup.post.v1.chat.completions,
]);
```

## License

MIT
