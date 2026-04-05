# @nakedapi/fal

[![npm](https://img.shields.io/npm/v/@nakedapi/fal?color=cb0000)](https://www.npmjs.com/package/@nakedapi/fal)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Fal Platform API provider for model management, pricing, usage, and analytics.

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
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

### POST Endpoints

<details>
<summary>**`models.pricing.estimate`** — `POST /models/pricing/estimate`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `estimate_type` | string | Yes | Type of cost estimate<br>Enum: `historical_api_price`, `unit_price` |
| `endpoints` | object | Yes |  |

**Validation:**

```typescript
// Access the schema
fal.pricing.estimate.payloadSchema

// Validate data
fal.pricing.estimate.validatePayload(data)
```

</details>

<details>
<summary>**`endpoint_id`** — `POST /{endpoint_id}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `endpoint_id` | string | Yes | Model endpoint ID (e.g. fal-ai/flux/schnell) |
| `input` | object | Yes | Model-specific input payload |
| `webhook` | string | No | Webhook URL for async notification |
| `priority` | string | No | Queue priority (defaults to normal)<br>Enum: `normal`, `low` |
| `timeout` | number | No | Server-side request timeout in seconds |
| `no_retry` | boolean | No | Disable automatic retries |

**Validation:**

```typescript
// Access the schema
fal.queue.submit.payloadSchema

// Validate data
fal.queue.submit.validatePayload(data)
```

</details>

<details>
<summary>**`serverless.logs.history`** — `POST /serverless/logs/history`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `limit` | number | No | Number of results per page (1-1000) |
| `cursor` | string | No | Pagination cursor from previous response |
| `start` | string | No | Start date in ISO8601 (defaults to 24h ago) |
| `end` | string | No | End date in ISO8601, exclusive (defaults to now) |
| `app_id` | array | No |  |
| `revision` | string | No | Filter by revision |
| `run_source` | string | No | Filter by run source<br>Enum: `grpc-run`, `grpc-register`, `gateway`, `cron` |
| `search` | string | No | Free-text search |
| `level` | string | No | Minimum log level |
| `job_id` | string | No | Filter by job ID |
| `request_id` | string | No | Filter by request ID |

**Validation:**

```typescript
// Access the schema
fal.logs.history.payloadSchema

// Validate data
fal.logs.history.validatePayload(data)
```

</details>

<details>
<summary>**`serverless.logs.stream`** — `POST /serverless/logs/stream`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `start` | string | No | Start date in ISO8601 (defaults to 24h ago) |
| `end` | string | No | End date in ISO8601, exclusive (defaults to now) |
| `app_id` | array | No |  |
| `revision` | string | No | Filter by revision |
| `run_source` | string | No | Filter by run source<br>Enum: `grpc-run`, `grpc-register`, `gateway`, `cron` |
| `search` | string | No | Free-text search |
| `level` | string | No | Minimum log level |
| `job_id` | string | No | Filter by job ID |
| `request_id` | string | No | Filter by request ID |

**Validation:**

```typescript
// Access the schema
fal.logs.stream.payloadSchema

// Validate data
fal.logs.stream.validatePayload(data)
```

</details>

<details>
<summary>**`serverless.files.file.url.file`** — `POST /serverless/files/file/url/{file}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | string | Yes | Target file path on fal storage |
| `url` | string | Yes | Publicly accessible URL to download the file from |

**Validation:**

```typescript
// Access the schema
fal.files.upload.url.payloadSchema

// Validate data
fal.files.upload.url.validatePayload(data)
```

</details>

<details>
<summary>**`serverless.files.file.local.target_path`** — `POST /serverless/files/file/local/{target_path}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `target_path` | string | Yes | Target file path on fal storage |
| `file` | object | Yes | Binary file content (Blob) |
| `filename` | string | No | Optional filename for the upload |
| `unzip` | boolean | No | If true and file is a ZIP, extract after upload |

**Validation:**

```typescript
// Access the schema
fal.files.upload.local.payloadSchema

// Validate data
fal.files.upload.local.validatePayload(data)
```

</details>

<details>
<summary>**`compute.instances`** — `POST /compute/instances`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instance_type` | string | Yes | GPU instance type<br>Enum: `gpu_8x_h100_sxm5`, `gpu_1x_h100_sxm5` |
| `ssh_key` | string | Yes | SSH public key for instance access |
| `sector` | string | No | Sector assignment (only valid with gpu_8x_h100_sxm5)<br>Enum: `sector_1`, `sector_2`, `sector_3` |

**Validation:**

```typescript
// Access the schema
fal.compute.instance.create.payloadSchema

// Validate data
fal.compute.instance.create.validatePayload(data)
```

</details>

<details>
<summary>**`workflows`** — `POST /workflows`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique workflow name (URL-safe) |
| `title` | string | No | Human-readable workflow title |
| `description` | string | No | Workflow description |
| `tags` | array | No |  |
| `is_public` | boolean | No | Whether the workflow is publicly visible |
| `contents` | object | Yes | Workflow definition contents (nodes and edges) |

**Validation:**

```typescript
// Access the schema
fal.workflow.create.payloadSchema

// Validate data
fal.workflow.create.validatePayload(data)
```

</details>

### DELETE Endpoints

<details>
<summary>**`serverless.apps.owner.name.queue`** — `DELETE /serverless/apps/{owner}/{name}/queue`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | string | Yes | Username of the app owner |
| `name` | string | Yes | Application name |
| `idempotency_key` | string | No | Optional idempotency key for safe retries |

**Validation:**

```typescript
// Access the schema
fal.apps.flush.queue.payloadSchema

// Validate data
fal.apps.flush.queue.validatePayload(data)
```

</details>

<details>
<summary>**`models.requests.request_id.payloads`** — `DELETE /models/requests/{request_id}/payloads`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `request_id` | string | Yes | Request ID whose payloads to delete |
| `idempotency_key` | string | No | Optional idempotency key |

**Validation:**

```typescript
// Access the schema
fal.delete.payloads.payloadSchema

// Validate data
fal.delete.payloads.validatePayload(data)
```

</details>

## Middleware

```typescript
import { fal as createFal, withRetry } from "@nakedapi/fal";

const fal = createFal({ apiKey: process.env.FAL_API_KEY! });
const models = withRetry(fal.get.v1.models, { retries: 3 });
```

## License

MIT
