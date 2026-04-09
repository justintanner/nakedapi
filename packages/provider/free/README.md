# @nakedapi/free

[![npm](https://img.shields.io/npm/v/@nakedapi/free?color=cb0000)](https://www.npmjs.com/package/@nakedapi/free)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Free file hosting providers — tmpfiles.org and file.io.

## Installation

```bash
npm install @nakedapi/free
# or
pnpm add @nakedapi/free
```

## Quick Start

```typescript
import { free as createFree } from "@nakedapi/free";

const free = createFree({ apiKey: process.env.FREE_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

### POST Endpoints

<details>
<summary><b><code>api.v1.upload</code></b> — <code>POST /api/v1/upload</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | The file to upload (Blob or File). Auto-deleted after 60 minutes. |
| `filename` | string | No | Optional filename for the upload (defaults to 'upload'). |

**Validation:**

```typescript
// Access the schema
free.tmpfiles.upload.payloadSchema

// Validate data
free.tmpfiles.upload.validatePayload(data)
```

</details>

<details>
<summary><b><code>upload</code></b> — <code>POST /upload</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | The file to upload (Blob or File). 128 MiB max. Expires after 3 hours. |
| `filename` | string | No | Optional filename for the upload (defaults to 'upload'). |

**Validation:**

```typescript
// Access the schema
free.uguu.upload.payloadSchema

// Validate data
free.uguu.upload.validatePayload(data)
```

</details>

## Middleware

```typescript
import { free as createFree, withRetry } from "@nakedapi/free";

const free = createFree({ apiKey: process.env.FREE_API_KEY! });
const models = withRetry(free.get.v1.models, { retries: 3 });
```

## License

MIT
