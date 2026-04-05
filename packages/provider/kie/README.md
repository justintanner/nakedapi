# @nakedapi/kie

[![npm](https://img.shields.io/npm/v/@nakedapi/kie?color=cb0000)](https://www.npmjs.com/package/@nakedapi/kie)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Kie provider for video and image generation (Kling 3.0, Grok Imagine, Nano Banana Pro).

## Installation

```bash
npm install @nakedapi/kie
# or
pnpm add @nakedapi/kie
```

## Quick Start

```typescript
import { kie as createKie } from "@nakedapi/kie";

const kie = createKie({ apiKey: process.env.KIE_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

### POST Endpoints

<details>
<summary><b><code>api.v1.jobs.createTask</code></b> — <code>POST /api/v1/jobs/createTask</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (discriminator for input shape) |
| `callBackUrl` | string | No | Webhook callback URL |
| `input` | object | Yes | Model-specific input parameters |

**Validation:**

```typescript
// Access the schema
kie.create.task.payloadSchema

// Validate data
kie.create.task.validatePayload(data)
```

</details>

<details>
<summary><b><code>api.v1.common.downloadurl</code></b> — <code>POST /api/v1/common/download-url</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Kie CDN URL to convert to a temporary download link |

**Validation:**

```typescript
// Access the schema
kie.download.url.payloadSchema

// Validate data
kie.download.url.validatePayload(data)
```

</details>

<details>
<summary><b><code>api.filestreamupload</code></b> — <code>POST /api/file-stream-upload</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | File to upload (Blob) |
| `filename` | string | Yes | Filename with extension |
| `mimeType` | string | No | MIME type override |

**Validation:**

```typescript
// Access the schema
kie.file.stream.upload.payloadSchema

// Validate data
kie.file.stream.upload.validatePayload(data)
```

</details>

<details>
<summary><b><code>api.fileurlupload</code></b> — <code>POST /api/file-url-upload</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Remote URL of the file to upload |
| `uploadPath` | string | No | Destination path (auto-generated if omitted) |

**Validation:**

```typescript
// Access the schema
kie.file.url.upload.payloadSchema

// Validate data
kie.file.url.upload.validatePayload(data)
```

</details>

<details>
<summary><b><code>api.filebase64upload</code></b> — <code>POST /api/file-base64-upload</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `base64` | string | Yes | Base64-encoded file data |
| `filename` | string | Yes | Filename with extension |
| `mimeType` | string | No | MIME type override |

**Validation:**

```typescript
// Access the schema
kie.file.base64.upload.payloadSchema

// Validate data
kie.file.base64.upload.validatePayload(data)
```

</details>

<details>
<summary><b><code>api.v1.veo.generate</code></b> — <code>POST /api/v1/veo/generate</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text prompt for video generation |
| `model` | string | No | Veo model variant<br>Enum: `veo3`, `veo3_fast` |
| `aspectRatio` | string | No | Output aspect ratio<br>Enum: `16:9`, `9:16`, `Auto` |
| `generationType` | string | No | Generation mode<br>Enum: `TEXT_2_VIDEO`, `REFERENCE_2_VIDEO`, `FIRST_AND_LAST_FRAMES_2_VIDEO` |
| `imageUrls` | array | No | Reference image URLs |
| `seeds` | number | No | Random seed |
| `watermark` | string | No | Watermark text |
| `enableTranslation` | boolean | No | Enable prompt translation |

**Validation:**

```typescript
// Access the schema
kie.veo.generate.payloadSchema

// Validate data
kie.veo.generate.validatePayload(data)
```

</details>

<details>
<summary><b><code>api.v1.veo.extend</code></b> — <code>POST /api/v1/veo/extend</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `taskId` | string | Yes | Task ID of the video to extend |
| `prompt` | string | Yes | Text prompt for extension |
| `model` | string | No | Extension quality mode<br>Enum: `fast`, `quality` |
| `seeds` | number | No | Random seed |
| `watermark` | string | No | Watermark text |

**Validation:**

```typescript
// Access the schema
kie.veo.extend.payloadSchema

// Validate data
kie.veo.extend.validatePayload(data)
```

</details>

<details>
<summary><b><code>api.v1.generate</code></b> — <code>POST /api/v1/generate</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text prompt or lyrics |
| `model` | string | Yes | Suno model version<br>Enum: `V4`, `V4_5`, `V4_5PLUS`, `V4_5ALL`, `V5` |
| `instrumental` | boolean | Yes | Generate instrumental (no vocals) |
| `customMode` | boolean | Yes | Enable custom mode |
| `style` | string | No | Music style/genre |
| `negativeTags` | string | No | Styles to avoid |
| `title` | string | No | Song title |

**Validation:**

```typescript
// Access the schema
kie.suno.generate.payloadSchema

// Validate data
kie.suno.generate.validatePayload(data)
```

</details>

<details>
<summary><b><code>gpt5.5.v1.chat.completions</code></b> — <code>POST /gpt-5.5/v1/chat/completions</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. gpt-5.5) |
| `messages` | array | Yes | Array of chat messages<br>Enum: `user`, `assistant`, `system` |
| `content` | string | Yes |  |
| `temperature` | number | No | Sampling temperature |
| `max_tokens` | number | No | Max tokens to generate |
| `stream` | boolean | No | Enable streaming |
| `response_format` | object | Yes | Response format configuration<br>Enum: `text`, `json_object`, `json_schema` |
| `json_schema` | object | No |  |

**Validation:**

```typescript
// Access the schema
kie.chat.completions55.payloadSchema

// Validate data
kie.chat.completions55.validatePayload(data)
```

</details>

<details>
<summary><b><code>gpt52.v1.chat.completions</code></b> — <code>POST /gpt-5-2/v1/chat/completions</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. gpt-5.5) |
| `messages` | array | Yes | Array of chat messages<br>Enum: `user`, `assistant`, `system` |
| `content` | string | Yes |  |
| `temperature` | number | No | Sampling temperature |
| `max_tokens` | number | No | Max tokens to generate |
| `stream` | boolean | No | Enable streaming |
| `response_format` | object | Yes | Response format configuration<br>Enum: `text`, `json_object`, `json_schema` |
| `json_schema` | object | No |  |

**Validation:**

```typescript
// Access the schema
kie.chat.completions.payloadSchema

// Validate data
kie.chat.completions.validatePayload(data)
```

</details>

<details>
<summary><b><code>claude.v1.messages</code></b> — <code>POST /claude/v1/messages</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model name<br>Enum: `claude-sonnet-4-6`, `claude-haiku-4-5` |
| `messages` | array | Yes | Conversation messages in chronological order<br>Enum: `user`, `assistant` |
| `content` | string | Yes |  |
| `tools` | array | Yes | Optional callable tools with input_schema |
| `description` | string | Yes |  |
| `input_schema` | object | Yes |  |
| `thinkingFlag` | boolean | No | Project-specific thinking flag |
| `stream` | boolean | No | If true, response is returned as SSE stream |

**Validation:**

```typescript
// Access the schema
kie.claude.messages.payloadSchema

// Validate data
kie.claude.messages.validatePayload(data)
```

</details>

## Middleware

```typescript
import { kie as createKie, withRetry } from "@nakedapi/kie";

const kie = createKie({ apiKey: process.env.KIE_API_KEY! });
const models = withRetry(kie.get.v1.models, { retries: 3 });
```

## License

MIT
