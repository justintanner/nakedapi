# @nakedapi/fireworks

[![npm](https://img.shields.io/npm/v/@nakedapi/fireworks?color=cb0000)](https://www.npmjs.com/package/@nakedapi/fireworks)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Fireworks AI provider — chat completions, text completions, embeddings, reranking, audio transcription/translation, batch inference, model management, deployments, datasets, fine-tuning (SFT, DPO, RFT), evaluators, and RLOR trainer jobs. OpenAI-compatible API with Fireworks-specific extensions. Completely standalone with zero external dependencies.

## Installation

```bash
npm install @nakedapi/fireworks
# or
pnpm add @nakedapi/fireworks
```

## Quick Start

```typescript
import { fireworks as createFireworks } from "@nakedapi/fireworks";

const fireworks = createFireworks({
  apiKey: process.env.FIREWORKS_API_KEY!,
});

const response = await fireworks.v1.chat.completions({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  messages: [{ role: "user", content: "Hello!" }],
});
```

## Endpoints

The Fireworks provider uses a verb-prefix pattern that mirrors HTTP methods:

```
fireworks.<verb>.v1.<path.in.camelCase>(params)
```

### POST Endpoints

Base URL: `https://api.fireworks.ai/inference/v1`

| URL                                  | Method Signature                                      |
| ------------------------------------ | ----------------------------------------------------- |
| `POST /chat/completions`             | `fireworks.post.v1.chat.completions(req)`             |
| `POST /completions`                  | `fireworks.post.v1.completions(req)`                  |
| `POST /embeddings`                   | `fireworks.post.v1.embeddings(req)`                   |
| `POST /rerank`                       | `fireworks.post.v1.rerank(req)`                       |
| `POST /messages`                     | `fireworks.post.v1.messages(req)`                     |
| `POST /workflows/.../text_to_image`  | `fireworks.post.v1.workflows.textToImage(model, req)` |
| `POST /workflows/...`                | `fireworks.post.v1.workflows.kontext(model, req)`     |
| `POST /workflows/.../get_result`     | `fireworks.post.v1.workflows.getResult(model, req)`   |
| `POST /audio/transcriptions`         | `fireworks.post.v1.audio.transcriptions(req)`         |
| `POST /audio/translations`           | `fireworks.post.v1.audio.translations(req)`           |
| `POST /audio/transcriptions` (batch) | `fireworks.post.v1.audio.batch.transcriptions(req)`   |
| `POST /audio/translations` (batch)   | `fireworks.post.v1.audio.batch.translations(req)`     |

#### Accounts Management (POST)

| URL                                                                  | Method Signature                                                             |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `POST /v1/accounts/{id}/users`                                       | `fireworks.post.v1.accounts.users.create(id, req, opts?)`                    |
| `POST /v1/accounts/{id}/users/{uid}` (update)                        | `fireworks.post.v1.accounts.users.update(id, uid, req)`                      |
| `POST /v1/accounts/{id}/models`                                      | `fireworks.post.v1.accounts.models.create(id, req)`                          |
| `POST /v1/accounts/{id}/models/{mid}:prepare`                        | `fireworks.post.v1.accounts.models.prepare(id, mid, req)`                    |
| `POST /v1/accounts/{id}/models/{mid}:getUploadEndpoint`              | `fireworks.post.v1.accounts.models.getUploadEndpoint(id, mid, req)`          |
| `POST /v1/accounts/{id}/deployments`                                 | `fireworks.post.v1.accounts.deployments.create(id, req, opts?)`              |
| `POST /v1/accounts/{id}/deployments/{did}:undelete`                  | `fireworks.post.v1.accounts.deployments.undelete(id, did)`                   |
| `POST /v1/accounts/{id}/deployedModels`                              | `fireworks.post.v1.accounts.deployedModels.create(id, req, opts?)`           |
| `POST /v1/accounts/{id}/users/{uid}/apiKeys`                         | `fireworks.post.v1.accounts.apiKeys.create(id, uid, req)`                    |
| `POST /v1/accounts/{id}/secrets`                                     | `fireworks.post.v1.accounts.secrets.create(id, req)`                         |
| `POST /v1/accounts/{id}/datasets`                                    | `fireworks.post.v1.accounts.datasets.create(id, req)`                        |
| `POST /v1/accounts/{id}/datasets/{did}:getUploadEndpoint`            | `fireworks.post.v1.accounts.datasets.getUploadEndpoint(id, did, req)`        |
| `POST /v1/accounts/{id}/datasets/{did}:validateUpload`               | `fireworks.post.v1.accounts.datasets.validateUpload(id, did, req?)`          |
| `POST /v1/accounts/{id}/batchInferenceJobs`                          | `fireworks.post.v1.accounts.batchInferenceJobs.create(id, req)`              |
| `POST /v1/accounts/{id}/supervisedFineTuningJobs`                    | `fireworks.post.v1.accounts.supervisedFineTuningJobs.create(req)`            |
| `POST /v1/accounts/{id}/supervisedFineTuningJobs/{jid}:resume`       | `fireworks.post.v1.accounts.supervisedFineTuningJobs.resume(req)`            |
| `POST /v1/accounts/{id}/dpoJobs`                                     | `fireworks.post.v1.accounts.dpoJobs.create(id, req)`                         |
| `POST /v1/accounts/{id}/dpoJobs/{jid}:resume`                        | `fireworks.post.v1.accounts.dpoJobs.resume(id, jid)`                         |
| `GET /v1/accounts/{id}/dpoJobs/{jid}:getMetricsFileEndpoint`         | `fireworks.post.v1.accounts.dpoJobs.getMetricsFileEndpoint(id, jid)`         |
| `POST /v1/accounts/{id}/evaluatorsV2`                                | `fireworks.post.v1.accounts.evaluators.create(id, req)`                      |
| `POST /v1/accounts/{id}/evaluators/{eid}:getUploadEndpoint`          | `fireworks.post.v1.accounts.evaluators.getUploadEndpoint(id, eid, req)`      |
| `POST /v1/accounts/{id}/evaluators/{eid}:validateUpload`             | `fireworks.post.v1.accounts.evaluators.validateUpload(id, eid)`              |
| `POST /v1/accounts/{id}/evaluationJobs`                              | `fireworks.post.v1.accounts.evaluationJobs.create(id, req)`                  |
| `GET /v1/accounts/{id}/evaluationJobs/{jid}:getExecutionLogEndpoint` | `fireworks.post.v1.accounts.evaluationJobs.getExecutionLogEndpoint(id, jid)` |
| `POST /v1/accounts/{id}/reinforcementFineTuningJobs`                 | `fireworks.post.v1.accounts.reinforcementFineTuningJobs.create(id, req)`     |
| `POST /v1/accounts/{id}/reinforcementFineTuningJobs/{jid}:resume`    | `fireworks.post.v1.accounts.reinforcementFineTuningJobs.resume(id, jid)`     |
| `POST /v1/accounts/{id}/rlorTrainerJobs`                             | `fireworks.post.v1.accounts.rlorTrainerJobs.create(id, req)`                 |
| `POST /v1/accounts/{id}/rlorTrainerJobs/{jid}:executeTrainStep`      | `fireworks.post.v1.accounts.rlorTrainerJobs.executeTrainStep(id, jid, req)`  |
| `POST /v1/accounts/{id}/rlorTrainerJobs/{jid}:resume`                | `fireworks.post.v1.accounts.rlorTrainerJobs.resume(id, jid)`                 |

### POST Stream Endpoints

| URL                               | Method Signature                                 |
| --------------------------------- | ------------------------------------------------ |
| `POST /chat/completions` (stream) | `fireworks.post.stream.v1.chat.completions(req)` |
| `POST /completions` (stream)      | `fireworks.post.stream.v1.completions(req)`      |
| `POST /messages` (stream)         | `fireworks.post.stream.v1.messages(req)`         |

### GET Endpoints

#### Accounts Management (GET)

| URL                                                             | Method Signature                                                              |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `GET /v1/accounts`                                              | `fireworks.get.v1.accounts.list(req?)`                                        |
| `GET /v1/accounts/{id}`                                         | `fireworks.get.v1.accounts.get(id, req?)`                                     |
| `GET /v1/accounts/{id}/users`                                   | `fireworks.get.v1.accounts.users.list(id, req?)`                              |
| `GET /v1/accounts/{id}/users/{uid}`                             | `fireworks.get.v1.accounts.users.get(id, uid, req?)`                          |
| `GET /v1/accounts/{id}/users/{uid}/apiKeys`                     | `fireworks.get.v1.accounts.apiKeys.list(id, uid, req?)`                       |
| `GET /v1/accounts/{id}/secrets`                                 | `fireworks.get.v1.accounts.secrets.list(id, req?)`                            |
| `GET /v1/accounts/{id}/secrets/{sid}`                           | `fireworks.get.v1.accounts.secrets.get(id, sid, req?)`                        |
| `GET /v1/accounts/{id}/models`                                  | `fireworks.get.v1.accounts.models.list(id, req?)`                             |
| `GET /v1/accounts/{id}/models/{mid}`                            | `fireworks.get.v1.accounts.models.get(id, mid, req?)`                         |
| `GET /v1/accounts/{id}/models/{mid}:getDownloadEndpoint`        | `fireworks.get.v1.accounts.models.getDownloadEndpoint(id, mid, req?)`         |
| `GET /v1/accounts/{id}/models/{mid}:validateUpload`             | `fireworks.get.v1.accounts.models.validateUpload(id, mid, req?)`              |
| `GET /v1/accounts/{id}/datasets`                                | `fireworks.get.v1.accounts.datasets.list(id, req?)`                           |
| `GET /v1/accounts/{id}/datasets/{did}`                          | `fireworks.get.v1.accounts.datasets.get(id, did, req?)`                       |
| `GET /v1/accounts/{id}/datasets/{did}:getDownloadEndpoint`      | `fireworks.get.v1.accounts.datasets.getDownloadEndpoint(id, did, req?)`       |
| `GET /v1/accounts/{id}/batchInferenceJobs`                      | `fireworks.get.v1.accounts.batchInferenceJobs.list(id, req?)`                 |
| `GET /v1/accounts/{id}/batchInferenceJobs/{jid}`                | `fireworks.get.v1.accounts.batchInferenceJobs.get(id, jid)`                   |
| `GET /v1/accounts/{id}/supervisedFineTuningJobs`                | `fireworks.get.v1.accounts.supervisedFineTuningJobs.list(req)`                |
| `GET /v1/accounts/{id}/supervisedFineTuningJobs/{jid}`          | `fireworks.get.v1.accounts.supervisedFineTuningJobs.get(req)`                 |
| `GET /v1/accounts/{id}/deployments`                             | `fireworks.get.v1.accounts.deployments.list(id, req?)`                        |
| `GET /v1/accounts/{id}/deployments/{did}`                       | `fireworks.get.v1.accounts.deployments.get(id, did)`                          |
| `GET /v1/accounts/{id}/deploymentShapes/{sid}`                  | `fireworks.get.v1.accounts.deploymentShapes.get(id, sid, req?)`               |
| `GET /v1/accounts/{id}/deploymentShapes/{sid}/versions`         | `fireworks.get.v1.accounts.deploymentShapes.versions.list(id, sid, req?)`     |
| `GET /v1/accounts/{id}/deploymentShapes/{sid}/versions/{vid}`   | `fireworks.get.v1.accounts.deploymentShapes.versions.get(id, sid, vid, req?)` |
| `GET /v1/accounts/{id}/deployedModels`                          | `fireworks.get.v1.accounts.deployedModels.list(id, req?)`                     |
| `GET /v1/accounts/{id}/deployedModels/{mid}`                    | `fireworks.get.v1.accounts.deployedModels.get(id, mid, req?)`                 |
| `GET /v1/accounts/{id}/dpoJobs`                                 | `fireworks.get.v1.accounts.dpoJobs.list(id, req?)`                            |
| `GET /v1/accounts/{id}/dpoJobs/{jid}`                           | `fireworks.get.v1.accounts.dpoJobs.get(id, jid, req?)`                        |
| `GET /v1/accounts/{id}/evaluators`                              | `fireworks.get.v1.accounts.evaluators.list(id, req?)`                         |
| `GET /v1/accounts/{id}/evaluators/{eid}`                        | `fireworks.get.v1.accounts.evaluators.get(id, eid, req?)`                     |
| `GET /v1/accounts/{id}/evaluators/{eid}:getBuildLogEndpoint`    | `fireworks.get.v1.accounts.evaluators.getBuildLogEndpoint(id, eid, req?)`     |
| `GET /v1/accounts/{id}/evaluators/{eid}:getSourceCodeSignedUrl` | `fireworks.get.v1.accounts.evaluators.getSourceCodeSignedUrl(id, eid, req?)`  |
| `GET /v1/accounts/{id}/evaluationJobs`                          | `fireworks.get.v1.accounts.evaluationJobs.list(id, req?)`                     |
| `GET /v1/accounts/{id}/evaluationJobs/{jid}`                    | `fireworks.get.v1.accounts.evaluationJobs.get(id, jid, req?)`                 |
| `GET /v1/accounts/{id}/reinforcementFineTuningJobs`             | `fireworks.get.v1.accounts.reinforcementFineTuningJobs.list(id, req?)`        |
| `GET /v1/accounts/{id}/reinforcementFineTuningJobs/{jid}`       | `fireworks.get.v1.accounts.reinforcementFineTuningJobs.get(id, jid, req?)`    |
| `GET /v1/accounts/{id}/rlorTrainerJobs`                         | `fireworks.get.v1.accounts.rlorTrainerJobs.list(id, req?)`                    |
| `GET /v1/accounts/{id}/rlorTrainerJobs/{jid}`                   | `fireworks.get.v1.accounts.rlorTrainerJobs.get(id, jid, req?)`                |
| `GET /v1/accounts/{id}/batch_job/{bid}`                         | `fireworks.get.v1.audio.batch.get(id, bid)`                                   |

### PATCH Endpoints

| URL                                               | Method Signature                                                     |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `PATCH /v1/accounts/{id}/users/{uid}`             | `fireworks.patch.v1.accounts.users.update(id, uid, req)`             |
| `PATCH /v1/accounts/{id}/models/{mid}`            | `fireworks.patch.v1.accounts.models.update(id, mid, req)`            |
| `PATCH /v1/accounts/{id}/datasets/{did}`          | `fireworks.patch.v1.accounts.datasets.update(id, did, req)`          |
| `PATCH /v1/accounts/{id}/deployments/{did}`       | `fireworks.patch.v1.accounts.deployments.update(id, did, req)`       |
| `PATCH /v1/accounts/{id}/deployments/{did}:scale` | `fireworks.patch.v1.accounts.deployments.scale(id, did, req)`        |
| `PATCH /v1/accounts/{id}/deployedModels/{mid}`    | `fireworks.patch.v1.accounts.deployedModels.update(id, mid, req)`    |
| `PATCH /v1/accounts/{id}/secrets/{sid}`           | `fireworks.patch.v1.accounts.secrets.update(id, sid, req)`           |
| `PATCH /v1/accounts/{id}/evaluators/{eid}`        | `fireworks.patch.v1.accounts.evaluators.update(id, eid, req, opts?)` |

### DELETE Endpoints

| URL                                                          | Method Signature                                                           |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `POST /v1/accounts/{id}/users/{uid}/apiKeys:delete`          | `fireworks.delete.v1.accounts.apiKeys.delete(id, uid, req)`                |
| `DELETE /v1/accounts/{id}/secrets/{sid}`                     | `fireworks.delete.v1.accounts.secrets.delete(id, sid)`                     |
| `DELETE /v1/accounts/{id}/models/{mid}`                      | `fireworks.delete.v1.accounts.models.delete(id, mid)`                      |
| `DELETE /v1/accounts/{id}/datasets/{did}`                    | `fireworks.delete.v1.accounts.datasets.delete(id, did)`                    |
| `DELETE /v1/accounts/{id}/batchInferenceJobs/{jid}`          | `fireworks.delete.v1.accounts.batchInferenceJobs.delete(id, jid)`          |
| `DELETE /v1/accounts/{id}/supervisedFineTuningJobs/{jid}`    | `fireworks.delete.v1.accounts.supervisedFineTuningJobs.delete(req)`        |
| `DELETE /v1/accounts/{id}/deployments/{did}`                 | `fireworks.delete.v1.accounts.deployments.delete(id, did, opts?)`          |
| `DELETE /v1/accounts/{id}/deployedModels/{mid}`              | `fireworks.delete.v1.accounts.deployedModels.delete(id, mid)`              |
| `DELETE /v1/accounts/{id}/dpoJobs/{jid}`                     | `fireworks.delete.v1.accounts.dpoJobs.delete(id, jid)`                     |
| `DELETE /v1/accounts/{id}/evaluators/{eid}`                  | `fireworks.delete.v1.accounts.evaluators.delete(id, eid)`                  |
| `DELETE /v1/accounts/{id}/evaluationJobs/{jid}`              | `fireworks.delete.v1.accounts.evaluationJobs.delete(id, jid)`              |
| `DELETE /v1/accounts/{id}/reinforcementFineTuningJobs/{jid}` | `fireworks.delete.v1.accounts.reinforcementFineTuningJobs.delete(id, jid)` |
| `DELETE /v1/accounts/{id}/rlorTrainerJobs/{jid}`             | `fireworks.delete.v1.accounts.rlorTrainerJobs.delete(id, jid)`             |

### WebSocket Endpoints

| URL                                     | Method Signature                                        |
| --------------------------------------- | ------------------------------------------------------- |
| `WS /v1/audio/transcriptions/streaming` | `fireworks.ws.v1.audio.transcriptions.streaming(opts?)` |

## Usage Examples

### Chat Completions

```typescript
const response = await fireworks.post.v1.chat.completions({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  messages: [{ role: "user", content: "Explain monads in one sentence." }],
  max_tokens: 256,
});
```

### Chat with Tools

```typescript
const response = await fireworks.post.v1.chat.completions({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  messages: [{ role: "user", content: "What's the weather in SF?" }],
  tools: [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get current weather",
        parameters: {
          type: "object",
          properties: { location: { type: "string" } },
          required: ["location"],
        },
      },
    },
  ],
  tool_choice: "auto",
});
```

### Chat with Structured Output

```typescript
const response = await fireworks.post.v1.chat.completions({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  messages: [{ role: "user", content: "List 3 colors" }],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "colors",
      schema: {
        type: "object",
        properties: {
          colors: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
});
```

### Text Completions

```typescript
const response = await fireworks.post.v1.completions({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  prompt: "Once upon a time",
  max_tokens: 100,
});
```

### Embeddings

```typescript
const response = await fireworks.post.v1.embeddings({
  model: "accounts/fireworks/models/nomic-embed-text-v1.5",
  input: "The food was delicious",
});
console.log(response.data[0].embedding);
```

### Embeddings with Fireworks-Specific Options

```typescript
const response = await fireworks.post.v1.embeddings({
  model: "accounts/fireworks/models/nomic-embed-text-v1.5",
  input: ["First document", "Second document"],
  dimensions: 512,
  prompt_template: "search_document: {prompt}",
  normalize: true,
});
```

### Reranking

```typescript
const response = await fireworks.post.v1.rerank({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  query: "What is the capital of France?",
  documents: [
    "Paris is the capital of France.",
    "London is the capital of the UK.",
  ],
  top_n: 3,
});
```

### Anthropic-Compatible Messages

```typescript
const response = await fireworks.post.v1.messages({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
```

### Streaming

```typescript
const stream = await fireworks.post.stream.v1.chat.completions({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  messages: [{ role: "user", content: "Write a short story." }],
});

for await (const chunk of stream) {
  const delta = chunk.choices?.[0]?.delta?.content;
  if (delta) {
    process.stdout.write(delta);
  }
}
```

### Audio Transcription

```typescript
const result = await fireworks.post.v1.audio.transcriptions({
  file: new Blob([audioBuffer], { type: "audio/mp3" }),
  model: "whisper-v3",
  language: "en",
});
console.log(result.text);
```

### Audio Translation

```typescript
const result = await fireworks.post.v1.audio.translations({
  file: new Blob([audioBuffer], { type: "audio/mp3" }),
  model: "whisper-v3",
});
console.log(result.text);
```

### Audio Batch Transcription

```typescript
const result = await fireworks.post.v1.audio.batch.transcriptions({
  endpoint_id: "your-endpoint-id",
  file: new Blob([audioBuffer], { type: "audio/mp3" }),
  model: "whisper-v3",
});
```

### Audio Streaming (WebSocket)

```typescript
const session = fireworks.ws.v1.audio.transcriptions.streaming({
  language: "en",
  response_format: "json",
});

// Send audio chunks
session.send(audioChunk);

// Receive transcriptions
for await (const msg of session) {
  if (msg.text) {
    console.log(msg.text);
  }
}

session.close();
```

### Model Management

```typescript
// List models
const models = await fireworks.get.v1.accounts.models.list("your-account-id");

// Create a model
const model = await fireworks.post.v1.accounts.models.create(
  "your-account-id",
  {
    name: "my-model",
    // ...
  }
);

// Update a model
const updated = await fireworks.patch.v1.accounts.models.update(
  "your-account-id",
  model.id,
  { name: "my-model-v2" }
);

// Delete a model
await fireworks.delete.v1.accounts.models.delete("your-account-id", model.id);
```

### Dataset Management

```typescript
// Create dataset
const dataset = await fireworks.post.v1.accounts.datasets.create(
  "your-account-id",
  {
    name: "training-data",
    // ...
  }
);

// List datasets
const datasets =
  await fireworks.get.v1.accounts.datasets.list("your-account-id");

// Get download URL
const { url } = await fireworks.get.v1.accounts.datasets.getDownloadEndpoint(
  "your-account-id",
  dataset.id
);
```

### Deployments

```typescript
// Create deployment
const deployment = await fireworks.post.v1.accounts.deployments.create(
  "your-account-id",
  {
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    // ...
  }
);

// Scale deployment
await fireworks.patch.v1.accounts.deployments.scale(
  "your-account-id",
  deployment.id,
  { min_workers: 2, max_workers: 10 }
);
```

### Supervised Fine-Tuning (SFT)

```typescript
// Create SFT job
const job = await fireworks.post.v1.accounts.supervisedFineTuningJobs.create({
  accountId: "your-account-id",
  model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
  dataset: "your-dataset-id",
  // ...
});

// Get job status
const status = await fireworks.get.v1.accounts.supervisedFineTuningJobs.get({
  accountId: "your-account-id",
  jobId: job.id,
});

// Resume job
await fireworks.post.v1.accounts.supervisedFineTuningJobs.resume({
  accountId: "your-account-id",
  jobId: job.id,
});
```

### DPO (Direct Preference Optimization)

```typescript
const job = await fireworks.post.v1.accounts.dpoJobs.create("your-account-id", {
  base_model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
  preference_dataset: "your-dataset-id",
  // ...
});
```

### Reinforcement Fine-Tuning (RFT)

```typescript
const job = await fireworks.post.v1.accounts.reinforcementFineTuningJobs.create(
  "your-account-id",
  {
    model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
    // ...
  }
);
```

### Evaluators

```typescript
// Create evaluator
const evaluator = await fireworks.post.v1.accounts.evaluators.create(
  "your-account-id",
  {
    name: "my-evaluator",
    // ...
  }
);

// Get build logs
const logs = await fireworks.get.v1.accounts.evaluators.getBuildLogEndpoint(
  "your-account-id",
  evaluator.id
);
```

## Configuration

```typescript
const fireworks = createFireworks({
  apiKey: "your-api-key", // required
  baseURL: "https://...", // optional, custom base URL
  timeout: 30000, // optional, ms (default: 30000)
  fetch: customFetch, // optional, custom fetch implementation
  audioBaseURL: "https://...", // optional, custom audio API URL
  audioStreamingBaseURL: "wss://...", // optional, custom audio streaming URL
  WebSocket: customWS, // optional, custom WebSocket implementation
});
```

## Middleware

```typescript
import {
  fireworks as createFireworks,
  withRetry,
  withFallback,
} from "@nakedapi/fireworks";

const fireworks = createFireworks({
  apiKey: process.env.FIREWORKS_API_KEY!,
});

// Retry on transient errors (429, 5xx)
const chat = withRetry(fireworks.post.v1.chat.completions, { retries: 3 });

// Failover across accounts
const primary = createFireworks({ apiKey: process.env.FIREWORKS_KEY_PRIMARY! });
const backup = createFireworks({ apiKey: process.env.FIREWORKS_KEY_BACKUP! });
const resilient = withFallback([
  primary.post.v1.chat.completions,
  backup.post.v1.chat.completions,
]);
```

## Payload Validation

```typescript
// Check schema
console.log(fireworks.post.v1.chat.completions.payloadSchema);

// Validate before sending
const { valid, errors } = fireworks.post.v1.chat.completions.validatePayload({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  messages: [{ role: "user", content: "Hello" }],
});
```

## Fireworks-Specific Features

Fireworks AI extends the OpenAI-compatible API with additional parameters:

### Chat Completions

- **`top_k`** — Limits token sampling to the top K candidates
- **`response_format.type: "json_schema"`** — Structured output with JSON schema enforcement
- **`perf_metrics_in_response`** — Include performance metrics in the response
- **`prompt_cache_isolation_key`** — Control prompt caching behavior across requests
- **`raw_output`** — Return raw model output without post-processing

### Embeddings

- **`dimensions`** — Reduce embedding dimensionality
- **`prompt_template`** — Template for wrapping input text (e.g., `"search_document: {prompt}"`)
- **`normalize`** — L2-normalize the output embeddings
- **`return_logits`** — Return raw logits instead of embeddings

### Model Format

Fireworks models use a namespaced format:

```
accounts/fireworks/models/<model-name>
```

For example: `accounts/fireworks/models/llama-v3p1-70b-instruct`

## License

MIT
