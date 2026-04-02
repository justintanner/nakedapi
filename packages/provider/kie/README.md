# @nakedapi/kie

[![npm](https://img.shields.io/npm/v/@nakedapi/kie?color=cb0000)](https://www.npmjs.com/package/@nakedapi/kie)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Kie provider for media generation — video, image, audio, and transcription. Supports Veo video generation, Suno music generation, chat completions, and Claude integration.

## Installation

```bash
npm install @nakedapi/kie
# or
pnpm add @nakedapi/kie
```

## Supported Models

| Model                                     | Type          | Description                                           |
| ----------------------------------------- | ------------- | ----------------------------------------------------- |
| `kling-3.0/video`                         | Video         | High-quality video generation with multi-shot support |
| `grok-imagine/text-to-image`              | Image         | Text-to-image generation                              |
| `grok-imagine/image-to-image`             | Image         | Image-to-image generation                             |
| `grok-imagine/text-to-video`              | Video         | Text-to-video generation                              |
| `grok-imagine/image-to-video`             | Video         | Image-to-video generation                             |
| `nano-banana-pro`                         | Image         | Advanced image generation                             |
| `bytedance/seedance-1.5-pro`              | Video         | Seedance video generation                             |
| `nano-banana-2`                           | Image         | Image generation with Google Search support           |
| `gpt-image/1.5-image-to-image`            | Image         | GPT image-to-image editing                            |
| `seedream/5-lite-image-to-image`          | Image         | Seedream image-to-image editing                       |
| `elevenlabs/text-to-dialogue-v3`          | Audio         | Multi-voice dialogue generation                       |
| `elevenlabs/sound-effect-v2`              | Audio         | Sound effect generation                               |
| `elevenlabs/speech-to-text`               | Transcription | Speech-to-text transcription                          |
| `sora-watermark-remover`                  | Video         | Remove watermarks from video                          |
| `veo3`, `veo3_fast`                       | Video         | Veo video generation (sub-provider)                   |
| `V4`, `V4_5`, `V4_5PLUS`, `V4_5ALL`, `V5` | Audio         | Suno music generation (sub-provider)                  |

## Usage

### Basic Example

```typescript
import { kie as createKie } from "@nakedapi/kie";

const kie = createKie({
  apiKey: process.env.KIE_API_KEY!,
});

// Create a video generation task with Kling 3.0
const { taskId } = await kie.post.api.v1.jobs.createTask({
  model: "kling-3.0/video",
  input: {
    prompt: "A futuristic cityscape with flying cars at sunset",
    sound: true,
    duration: "5",
    mode: "pro",
    multi_shots: false,
  },
});

console.log("Task ID:", taskId);
```

### Grok Imagine - Text to Image

```typescript
const { taskId } = await kie.post.api.v1.jobs.createTask({
  model: "grok-imagine/text-to-image",
  input: {
    prompt: "A serene mountain landscape at dawn with misty valleys",
    aspect_ratio: "16:9",
  },
});

console.log("Task ID:", taskId);
```

### Grok Imagine - Text to Video

```typescript
const { taskId } = await kie.post.api.v1.jobs.createTask({
  model: "grok-imagine/text-to-video",
  input: {
    prompt: "A time-lapse of flowers blooming in a garden",
    aspect_ratio: "16:9",
    duration: "10",
  },
});

console.log("Task ID:", taskId);
```

### Upload Media (Stream)

```typescript
import { readFile } from "node:fs/promises";

const buffer = await readFile("./my-image.png");
const file = new Blob([buffer], { type: "image/png" });

const { downloadUrl } = await kie.post.api.fileStreamUpload({
  file,
  filename: "my-image.png",
});

console.log("Uploaded to:", downloadUrl);
```

### Upload Media (URL)

```typescript
const { downloadUrl } = await kie.post.api.fileUrlUpload({
  url: "https://example.com/image.jpg",
  uploadPath: "uploads/my-image.jpg",
});
```

### Upload Media (Base64)

```typescript
const { downloadUrl } = await kie.post.api.fileBase64Upload({
  base64:
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  filename: "pixel.png",
  mimeType: "image/png",
});
```

### Get Temporary Download URL

Convert a kie.ai file URL into a temporary downloadable link (valid 20 minutes):

```typescript
const { url } = await kie.post.api.v1.common.downloadUrl({
  url: "https://cdn.kie.ai/files/some-generated-video.mp4",
});

console.log("Download from:", url);
```

### Check Task Status

```typescript
const task = await kie.get.api.v1.jobs.recordInfo(taskId);

if (task.state === "success") {
  console.log("Result URLs:", task.result?.resultUrls);
} else if (task.state === "fail") {
  console.log("Failed:", task.failMsg);
} else {
  console.log(`In progress: ${task.progress}% (${task.state})`);
}
```

### Check Credit Balance

```typescript
const { credit } = await kie.get.api.v1.chat.credit();
console.log(`Available credits: ${credit}`);
```

### Nano Banana Pro

```typescript
const { taskId } = await kie.post.api.v1.jobs.createTask({
  model: "nano-banana-pro",
  input: {
    prompt: "A detailed illustration of a vintage bicycle in a Parisian street",
    aspect_ratio: "3:2",
    resolution: "2K",
    output_format: "png",
  },
});

console.log("Task ID:", taskId);
```

### Kling 3.0 Multi-Shot Video

```typescript
const { taskId } = await kie.post.api.v1.jobs.createTask({
  model: "kling-3.0/video",
  input: {
    image_urls: ["https://example.com/first-frame.jpg"],
    sound: true,
    duration: "10",
    aspect_ratio: "16:9",
    mode: "pro",
    multi_shots: true,
    multi_prompt: [
      { prompt: "A car driving through a city", duration: 5 },
      { prompt: "The car parks in front of a building", duration: 5 },
    ],
  },
});
```

## Endpoints

Base URL: `https://api.kie.ai`

### POST Endpoints

| URL                                | Method Signature                          |
| ---------------------------------- | ----------------------------------------- |
| `POST /api/v1/jobs/createTask`     | `kie.post.api.v1.jobs.createTask(req)`    |
| `POST /api/v1/common/download-url` | `kie.post.api.v1.common.downloadUrl(req)` |
| `POST /api/file-stream-upload`     | `kie.post.api.fileStreamUpload(req)`      |
| `POST /api/file-url-upload`        | `kie.post.api.fileUrlUpload(req)`         |
| `POST /api/file-base64-upload`     | `kie.post.api.fileBase64Upload(req)`      |

### GET Endpoints

| URL                                   | Method Signature                         |
| ------------------------------------- | ---------------------------------------- |
| `GET /api/v1/jobs/recordInfo?taskId=` | `kie.get.api.v1.jobs.recordInfo(taskId)` |
| `GET /api/v1/chat/credit`             | `kie.get.api.v1.chat.credit()`           |

### Sub-Providers

#### Veo (Video Generation)

| URL                         | Method Signature                        |
| --------------------------- | --------------------------------------- |
| `POST /api/v1/veo/generate` | `kie.veo.post.api.v1.veo.generate(req)` |
| `POST /api/v1/veo/extend`   | `kie.veo.post.api.v1.veo.extend(req)`   |

**Veo Example:**

```typescript
// Generate video
const result = await kie.veo.post.api.v1.veo.generate({
  prompt: "A drone shot of a coastal landscape",
  model: "veo3",
  aspectRatio: "16:9",
  generationType: "TEXT_2_VIDEO",
});

// Extend existing video
const extended = await kie.veo.post.api.v1.veo.extend({
  taskId: "previous-task-id",
  prompt: "Continue with the same style",
  model: "fast",
});
```

#### Suno (Music Generation)

| URL                     | Method Signature                     |
| ----------------------- | ------------------------------------ |
| `POST /api/v1/generate` | `kie.suno.post.api.v1.generate(req)` |

**Suno Example:**

```typescript
const result = await kie.suno.post.api.v1.generate({
  prompt: "An upbeat pop song about summer",
  model: "V4",
  instrumental: false,
  customMode: true,
  style: "pop",
  title: "Summer Vibes",
});
```

#### Chat Completions (GPT-5.5 / GPT-5-2)

| URL                                 | Method Signature                       |
| ----------------------------------- | -------------------------------------- |
| `POST /gpt-5.5/v1/chat/completions` | `kie.chat.completions(req)`            |
| `POST /gpt-5-2/v1/chat/completions` | `kie.chat.completions(req)` (fallback) |

**Chat Example:**

```typescript
const response = await kie.chat.completions({
  model: "gpt-5.5",
  messages: [{ role: "user", content: "Hello!" }],
  temperature: 0.7,
  max_tokens: 1024,
});

console.log(response.choices?.[0]?.message?.content);
```

#### Claude Integration

| URL                        | Method Signature                   |
| -------------------------- | ---------------------------------- |
| `POST /claude/v1/messages` | `kie.claude.post.v1.messages(req)` |

**Claude Example:**

```typescript
const response = await kie.claude.post.v1.messages({
  model: "claude-sonnet-4-6",
  messages: [{ role: "user", content: "Explain quantum computing" }],
  thinkingFlag: true,
});

console.log(response.content?.[0]?.text);
```

## Data Shaping

| Method                          | What happens                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `post.api.fileStreamUpload()`   | Infers MIME type from filename, generates timestamped upload path, wraps in FormData |
| `post.api.fileUrlUpload()`      | Generates timestamped upload path if not provided                                    |
| `post.api.fileBase64Upload()`   | Infers MIME type from filename, generates timestamped upload path                    |
| `post.api.v1.jobs.createTask()` | Passes through request body directly to model input                                  |
| `chat.completions()`            | Built-in fallback: tries gpt-5.5 first, then gpt-5-2                                 |

## API Reference

### `kie(options)`

Creates a Kie provider instance.

**Options:**

- `apiKey` (string, required): Your Kie API key
- `baseURL` (string, optional): Custom API base URL (default: `https://api.kie.ai`)
- `uploadBaseURL` (string, optional): Custom upload base URL (default: `https://kieai.redpandaai.co`)
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)
- `fetch` (function, optional): Custom fetch implementation

**Core API methods:**

- `kie.post.api.v1.jobs.createTask(req)`: Creates a media generation task
- `kie.get.api.v1.jobs.recordInfo(taskId)`: Returns current task state, progress, and results
- `kie.post.api.fileStreamUpload(req)`: Uploads a file stream and returns a hosted URL
- `kie.post.api.fileUrlUpload(req)`: Uploads a file from URL
- `kie.post.api.fileBase64Upload(req)`: Uploads a base64-encoded file
- `kie.post.api.v1.common.downloadUrl(req)`: Converts a kie.ai file URL to a temporary download link (20 min)
- `kie.get.api.v1.chat.credit()`: Returns account credit balance

**Sub-providers:**

- `kie.veo.post.api.v1.veo.generate(req)`: Generate video with Veo (veo3, veo3_fast)
- `kie.veo.post.api.v1.veo.extend(req)`: Extend an existing Veo video
- `kie.suno.post.api.v1.generate(req)`: Generate music with Suno
- `kie.chat.completions(req)`: Chat completions with built-in fallback (gpt-5.5 → gpt-5-2)
- `kie.claude.post.v1.messages(req)`: Claude messages API

## Payload Validation

All POST endpoints expose `.payloadSchema` and `.validatePayload()`:

```typescript
// Access the schema
const schema = kie.post.api.v1.jobs.createTask.payloadSchema;

// Validate before sending
const result = kie.post.api.v1.jobs.createTask.validatePayload({
  model: "kling-3.0/video",
  input: { prompt: "A sunset over mountains" },
});

if (!result.valid) {
  console.error(result.errors);
}
```

## Configuration

```typescript
import { kie as createKie } from "@nakedapi/kie";

const kie = createKie({
  apiKey: "your-api-key",
  baseURL: "https://api.kie.ai", // optional
  uploadBaseURL: "https://kieai.redpandaai.co", // optional
  timeout: 30000, // optional, default: 30000ms
  fetch: customFetch, // optional
});
```

## Middleware

```typescript
import { kie as createKie, withRetry } from "@nakedapi/kie";

const kie = createKie({ apiKey: process.env.KIE_API_KEY! });

// Add retry logic
const resilientTask = withRetry(kie.post.api.v1.jobs.createTask, {
  retries: 3,
  baseMs: 500,
});
```

## License

MIT
