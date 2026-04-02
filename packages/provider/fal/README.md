# @nakedapi/fal

[![npm](https://img.shields.io/npm/v/@nakedapi/fal?color=cb0000)](https://www.npmjs.com/package/@nakedapi/fal)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Fal provider — model registry, pricing, usage analytics, request management, queue operations, serverless logs and files, workflow management, and compute instances. Completely standalone with zero external dependencies.

## Installation

```bash
npm install @nakedapi/fal
# or
pnpm add @nakedapi/fal
```

## Quick Start

```typescript
import { fal as createFal } from "@nakedapi/fal";

const fal = createFal({ apiKey: process.env.FAL_API_KEY! });

const models = await fal.v1.models({ search: "flux" });
const pricing = await fal.v1.models.pricing({ appId: "fal-ai/flux" });
const usage = await fal.v1.models.usage();
```

## Endpoints

The Fal provider uses a verb-prefix pattern that mirrors HTTP methods:

```
fal.<verb>.v1.<path.in.camelCase>(params)
```

### GET Endpoints

Base URL: `https://api.fal.ai/v1`

#### Models

| URL                                | Method Signature                             |
| ---------------------------------- | -------------------------------------------- |
| `GET /models`                      | `fal.get.v1.models(req?)`                    |
| `GET /models/pricing`              | `fal.get.v1.models.pricing(req)`             |
| `GET /models/usage`                | `fal.get.v1.models.usage(req?)`              |
| `GET /models/analytics`            | `fal.get.v1.models.analytics(req)`           |
| `GET /models/requests/by-endpoint` | `fal.get.v1.models.requests.byEndpoint(req)` |

#### Queue

| URL                                               | Method Signature               |
| ------------------------------------------------- | ------------------------------ |
| `GET /{endpoint_id}/requests/{request_id}/status` | `fal.get.v1.queue.status(req)` |
| `GET /{endpoint_id}/requests/{request_id}`        | `fal.get.v1.queue.result(req)` |

#### Serverless

| URL                                         | Method Signature                                  |
| ------------------------------------------- | ------------------------------------------------- |
| `POST /serverless/logs/history`             | `fal.get.v1.serverless.logs.history(req?, body?)` |
| `GET /serverless/files/list`                | `fal.get.v1.serverless.files.list(req?)`          |
| `GET /serverless/files/file/{file}`         | `fal.get.v1.serverless.files.download(req)`       |
| `GET /serverless/apps/{owner}/{name}/queue` | `fal.get.v1.serverless.apps.queue(req)`           |
| `GET /serverless/metrics`                   | `fal.get.v1.serverless.metrics()`                 |

#### Workflows

| URL                                         | Method Signature                |
| ------------------------------------------- | ------------------------------- |
| `GET /workflows`                            | `fal.get.v1.workflows(req?)`    |
| `GET /workflows/{username}/{workflow_name}` | `fal.get.v1.workflows.get(req)` |

#### Compute

| URL                           | Method Signature                        |
| ----------------------------- | --------------------------------------- |
| `GET /compute/instances`      | `fal.get.v1.compute.instances(req?)`    |
| `GET /compute/instances/{id}` | `fal.get.v1.compute.instances.get(req)` |

### POST Endpoints

#### Models

| URL                             | Method Signature                           |
| ------------------------------- | ------------------------------------------ |
| `POST /models/pricing/estimate` | `fal.post.v1.models.pricing.estimate(req)` |

#### Queue

| URL                           | Method Signature                |
| ----------------------------- | ------------------------------- |
| `POST /{endpoint_id}` (queue) | `fal.post.v1.queue.submit(req)` |

#### Serverless

| URL                                               | Method Signature                                   |
| ------------------------------------------------- | -------------------------------------------------- |
| `POST /serverless/logs/history`                   | `fal.post.v1.serverless.logs.history(req?, body?)` |
| `POST /serverless/files/file/url/{file}`          | `fal.post.v1.serverless.files.uploadUrl(req)`      |
| `POST /serverless/files/file/local/{target_path}` | `fal.post.v1.serverless.files.uploadLocal(req)`    |

#### Compute

| URL                       | Method Signature                            |
| ------------------------- | ------------------------------------------- |
| `POST /compute/instances` | `fal.post.v1.compute.instances(req)`        |
| `POST /compute/instances` | `fal.post.v1.compute.instances.create(req)` |

### POST Stream Endpoints

| URL                                  | Method Signature                                         |
| ------------------------------------ | -------------------------------------------------------- |
| `POST /serverless/logs/stream` (SSE) | `fal.post.stream.v1.serverless.logs.stream(req?, body?)` |

### PUT Endpoints

| URL                                               | Method Signature               |
| ------------------------------------------------- | ------------------------------ |
| `PUT /{endpoint_id}/requests/{request_id}/cancel` | `fal.put.v1.queue.cancel(req)` |

### DELETE Endpoints

| URL                                             | Method Signature                                 |
| ----------------------------------------------- | ------------------------------------------------ |
| `DELETE /models/requests/{request_id}/payloads` | `fal.delete.v1.models.requests.payloads(req)`    |
| `DELETE /serverless/apps/{owner}/{name}/queue`  | `fal.delete.v1.serverless.apps.queue.flush(req)` |
| `DELETE /compute/instances/{id}`                | `fal.delete.v1.compute.instances.terminate(req)` |

## Usage Examples

### Browse Models

```typescript
const models = await fal.get.v1.models({ search: "flux" });
```

### Pricing

```typescript
const pricing = await fal.get.v1.models.pricing({ appId: "fal-ai/flux" });

// Estimate cost before running
const estimate = await fal.post.v1.models.pricing.estimate({
  appId: "fal-ai/flux",
  input: { prompt: "A cat" },
});
```

### Usage & Analytics

```typescript
const usage = await fal.get.v1.models.usage();
const analytics = await fal.get.v1.models.analytics({});
const byEndpoint = await fal.get.v1.models.requests.byEndpoint({});
```

### Delete Request Payloads

```typescript
await fal.delete.v1.models.requests.payloads({
  request_id: "req-123",
  idempotency_key: "unique-key",
});
```

### Queue Operations

```typescript
// Submit to queue
const submitted = await fal.post.v1.queue.submit({
  endpoint_id: "fal-ai/flux",
  input: { prompt: "A futuristic city" },
});

// Check status
const status = await fal.get.v1.queue.status({
  endpoint_id: "fal-ai/flux",
  request_id: submitted.request_id,
});

// Get result
const result = await fal.get.v1.queue.result({
  endpoint_id: "fal-ai/flux",
  request_id: submitted.request_id,
});

// Cancel request
await fal.put.v1.queue.cancel({
  endpoint_id: "fal-ai/flux",
  request_id: submitted.request_id,
});
```

### Serverless Logs

```typescript
// Get log history
const logs = await fal.get.v1.serverless.logs.history({
  app_name: "my-app",
});

// Stream logs (SSE)
const stream = await fal.post.stream.v1.serverless.logs.stream({
  app_name: "my-app",
});

for await (const entry of stream) {
  console.log(entry.message);
}
```

### Serverless Files

```typescript
// List files
const files = await fal.get.v1.serverless.files.list();

// Download file
const response = await fal.get.v1.serverless.files.download({
  file: "path/to/file.txt",
});
const content = await response.text();

// Upload via URL
await fal.post.v1.serverless.files.uploadUrl({
  file: "path/to/file.txt",
  url: "https://example.com/file.txt",
});

// Upload local file
const file = new Blob(["content"], { type: "text/plain" });
await fal.post.v1.serverless.files.uploadLocal({
  file,
  target_path: "uploads/file.txt",
  filename: "file.txt",
  unzip: false,
});
```

### Serverless App Queue

```typescript
// Get queue status
const queue = await fal.get.v1.serverless.apps.queue({
  owner: "my-org",
  name: "my-app",
});

// Flush queue
await fal.delete.v1.serverless.apps.queue.flush({
  owner: "my-org",
  name: "my-app",
  idempotency_key: "unique-key",
});
```

### Metrics

```typescript
const metrics = await fal.get.v1.serverless.metrics();
console.log(metrics); // Prometheus format
```

### Workflows

```typescript
// List workflows
const workflows = await fal.get.v1.workflows();

// Get specific workflow
const workflow = await fal.get.v1.workflows.get({
  username: "my-user",
  workflow_name: "my-workflow",
});
```

### Compute Instances

```typescript
// List instances
const instances = await fal.get.v1.compute.instances();

// Get specific instance
const instance = await fal.get.v1.compute.instances.get({ id: "instance-123" });

// Create instance
const created = await fal.post.v1.compute.instances.create({
  name: "my-instance",
  type: "cpu",
  // ...
});

// Terminate instance
await fal.delete.v1.compute.instances.terminate({ id: "instance-123" });
```

## Data Shaping

These endpoints transform input before sending (all others are pure pass-through):

| Method                                                                                | What happens                                                                   |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `get.v1.models()`, `.pricing()`, `.usage()`, `.analytics()`, `.requests.byEndpoint()` | Converts param objects to URL query strings                                    |
| `get.v1.serverless.logs.history()`, `post.v1.serverless.logs.history()`               | Converts params to query string, sends body separately                         |
| `post.stream.v1.serverless.logs.stream()`                                             | SSE streaming with AsyncIterable response                                      |
| `delete.v1.models.requests.payloads()`                                                | Moves `idempotency_key` from params to `Idempotency-Key` header                |
| `post.v1.queue.submit()`                                                              | Moves queue-specific headers (`X-Fal-Queue-Priority`, etc.) to request headers |
| `post.v1.serverless.files.uploadLocal()`                                              | Wraps file in FormData, optionally adds `unzip` query param                    |
| `delete.v1.serverless.apps.queue.flush()`                                             | Moves `idempotency_key` from params to `Idempotency-Key` header                |

## Configuration

```typescript
const fal = createFal({
  apiKey: "your-api-key", // required
  baseURL: "https://...", // optional, custom base URL
  queueBaseURL: "https://...", // optional, custom queue base URL
  timeout: 30000, // optional, ms (default: 30000)
  fetch: customFetch, // optional, custom fetch implementation
});
```

## Middleware

```typescript
import { fal as createFal, withRetry } from "@nakedapi/fal";

const fal = createFal({ apiKey: process.env.FAL_API_KEY! });
const models = withRetry(fal.get.v1.models, { retries: 3 });
```

## License

MIT
