# @nakedapi/kimicoding

[![npm](https://img.shields.io/npm/v/@nakedapi/kimicoding?color=cb0000)](https://www.npmjs.com/package/@nakedapi/kimicoding)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Kimi for Coding provider for NakedAPI - completely standalone with Anthropic Messages API format, streaming-first, and built-in middleware.

## Installation

```bash
npm install @nakedapi/kimicoding
# or
pnpm add @nakedapi/kimicoding
```

## Quick Start

```typescript
import { kimicoding as createKimicoding } from "@nakedapi/kimicoding";

const kimicoding = createKimicoding({ apiKey: process.env.KIMICODING_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

### POST Endpoints

<details>
<summary><b><code>v1.embeddings</code></b> — <code>POST /v1/embeddings</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input` | string | Yes | Input text to embed (string, string[], number[], or number[][]) |
| `model` | string | Yes | Model ID |
| `encoding_format` | string | No | Encoding format for embeddings<br>Enum: `float`, `base64` |
| `dimensions` | number | No | Number of dimensions for the output embeddings |
| `user` | string | No | Unique identifier for the end-user |

**Validation:**

```typescript
// Access the schema
kimicoding.embeddings.payloadSchema

// Validate data
kimicoding.embeddings.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.messages</code></b> — <code>POST /v1/messages</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. k2p5) |
| `messages` | array | Yes | Array of chat messages<br>Enum: `user`, `assistant` |
| `content` | string | Yes |  |
| `max_tokens` | number | Yes | Maximum tokens to generate |
| `system` | string | No | System prompt |
| `temperature` | number | No | Sampling temperature (k2p5: fixed 0.6 non-thinking / 1.0 thinking, user value ignored) |
| `top_p` | number | No | Nucleus sampling threshold |
| `stop_sequences` | array | No | Stop sequences |
| `stream` | boolean | No | Enable streaming |

**Validation:**

```typescript
// Access the schema
kimicoding.messages.payloadSchema

// Validate data
kimicoding.messages.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.tokens.count</code></b> — <code>POST /v1/tokens/count</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. k2p5) |
| `messages` | array | Yes | Array of chat messages to count tokens for<br>Enum: `user`, `assistant` |
| `content` | string | Yes |  |
| `system` | string | No | System prompt |

**Validation:**

```typescript
// Access the schema
kimicoding.count.tokens.payloadSchema

// Validate data
kimicoding.count.tokens.validatePayload(data)
```

</details>

## Middleware

```typescript
import { kimicoding as createKimicoding, withRetry } from "@nakedapi/kimicoding";

const kimicoding = createKimicoding({ apiKey: process.env.KIMICODING_API_KEY! });
const models = withRetry(kimicoding.get.v1.models, { retries: 3 });
```

## License

MIT
