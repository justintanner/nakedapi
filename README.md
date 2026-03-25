# NakedAPI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build](https://github.com/justintanner/nakedapi/actions/workflows/ci.yml/badge.svg)](https://github.com/justintanner/nakedapi/actions)

Standalone-first TypeScript AI provider packages. Each is self-contained with zero external dependencies.

## Features

- **Standalone** — each provider is independent, no shared runtime
- **Streaming** — real-time token streaming via AsyncIterable
- **Middleware** — retry with backoff, multi-provider fallback
- **Edge Compatible** — Node.js, Cloudflare Workers, Deno
- **Strict TypeScript** — 100% typed, zero `any`
- **Polly.js Harness** — record/replay integration tests with review UI

## Architecture

```
packages/provider/
├── fal/         – @nakedapi/fal (model registry, pricing, analytics)
├── kie/         – @nakedapi/kie (media generation, chat, audio)
├── kimicoding/  – @nakedapi/kimicoding (Anthropic Messages API)
├── openai/      – @nakedapi/openai (chat, transcription)
└── xai/         – @nakedapi/xai (Grok chat, search, images, video)
```

## Quick Start

### Kimi for Coding

```bash
npm install @nakedapi/kimicoding
```

```typescript
import { kimicoding, type ChatRequest } from "@nakedapi/kimicoding";

const provider = kimicoding({ apiKey: process.env.KIMI_CODING_API_KEY! });

for await (const chunk of provider.coding.v1.messages.stream({
  model: "k2p5",
  messages: [{ role: "user", content: "Hello!" }],
})) {
  if (chunk.delta) process.stdout.write(chunk.delta);
}
```

### Kie (Media Generation)

```bash
npm install @nakedapi/kie
```

```typescript
import { kie } from "@nakedapi/kie";

const provider = kie({ apiKey: process.env.KIE_API_KEY! });

const { taskId } = await provider.api.v1.jobs.createTask({
  model: "nano-banana-pro",
  input: { prompt: "A serene mountain landscape", aspect_ratio: "16:9" },
});

// Upload media for generation endpoints
const upload = await provider.api.fileStreamUpload({
  file: new Blob([fileBuffer]),
  filename: "photo.png",
});

const video = await provider.api.v1.jobs.createTask({
  model: "grok-imagine/image-to-video",
  input: { image_urls: [upload.downloadUrl] },
});
```

### OpenAI (Chat & Transcription)

```bash
npm install @nakedapi/openai
```

```typescript
import { openai } from "@nakedapi/openai";

const provider = openai({ apiKey: process.env.OPENAI_API_KEY! });

// Chat with tool support
const response = await provider.v1.chat.completions({
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(response.content);

// Transcribe audio
const result = await provider.v1.audio.transcriptions({
  file: new Blob([mp3Buffer], { type: "audio/mp3" }),
});
console.log(result.text);
```

### xAI (Grok Chat & Search)

```bash
npm install @nakedapi/xai
```

```typescript
import { xai } from "@nakedapi/xai";

const provider = xai({ apiKey: process.env.XAI_API_KEY! });

const response = await provider.v1.chat.completions({
  model: "grok-4-fast",
  messages: [{ role: "user", content: "Hello!" }],
});

const searchResult = await provider.v1.chat.completions.search(
  "latest TypeScript news"
);
```

### Fal (Model Registry & Analytics)

```bash
npm install @nakedapi/fal
```

```typescript
import { fal } from "@nakedapi/fal";

const provider = fal({ apiKey: process.env.FAL_API_KEY! });

const models = await provider.v1.models({ search: "flux" });
const pricing = await provider.v1.models.pricing({ appId: "fal-ai/flux" });
const usage = await provider.v1.models.usage();
```

## Providers

| Package | Methods | Models |
|---------|---------|--------|
| [@nakedapi/fal](packages/provider/fal) | `v1.models()`, `.pricing()`, `.usage()`, `.analytics()`, `.requests` | Model registry/marketplace |
| [@nakedapi/kie](packages/provider/kie) | `api.v1.jobs.createTask()`, `.recordInfo()`, `api.fileStreamUpload()`, sub-providers (chat, veo, suno) | Kling 3.0, Grok Imagine, Nano Banana, GPT Image, Seedance, ElevenLabs |
| [@nakedapi/kimicoding](packages/provider/kimicoding) | `coding.v1.messages()`, `.stream()` | `k2p5` (32K max tokens) |
| [@nakedapi/openai](packages/provider/openai) | `v1.chat.completions()`, `v1.audio.transcriptions()` | `gpt-5.4-2026-03-05`, `gpt-4o-mini-transcribe` |
| [@nakedapi/xai](packages/provider/xai) | `v1.chat.completions()`, `.search()`, `v1.images.generations()`, `.edits()`, `v1.videos.generations()`, `.edits()` | `grok-4-fast`, `grok-imagine-image`, `grok-imagine-video` |

## Middleware

Every package exports `withRetry` and `withFallback` — generic function-level wrappers that work with any `(req, signal?) => Promise<T>` call. `@nakedapi/kimicoding` additionally exports `withStreamRetry` and `withStreamFallback` for async iterables.

### `withRetry` — Exponential Backoff

Wraps a single API call with automatic retries on transient errors (HTTP 429 and 5xx).

```typescript
import { openai, withRetry } from "@nakedapi/openai";

const provider = openai({ apiKey: process.env.OPENAI_API_KEY! });

const chat = withRetry(provider.v1.chat.completions, {
  retries: 3,   // max retry attempts (default: 2)
  baseMs: 500,  // initial delay in ms (default: 300)
  factor: 2,    // exponential multiplier (default: 2)
  jitter: true, // randomize delay ±20% (default: true)
});

const response = await chat({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Explain monads in one sentence." }],
});
```

Works the same way across all providers:

```typescript
import { xai, withRetry } from "@nakedapi/xai";

const provider = xai({ apiKey: process.env.XAI_API_KEY! });
const chat = withRetry(provider.v1.chat.completions);
```

### `withFallback` — Multi-Function Failover

Tries each function in order. If one fails, the next picks up. Useful for redundant API keys, separate accounts, or mixing providers.

```typescript
import { openai, withFallback } from "@nakedapi/openai";

const primary = openai({ apiKey: process.env.OPENAI_KEY_PRIMARY! });
const backup = openai({ apiKey: process.env.OPENAI_KEY_BACKUP! });

const chat = withFallback(
  [primary.v1.chat.completions, backup.v1.chat.completions],
  {
    onFallback: (error, index) => {
      console.warn(`Function ${index} failed, falling back:`, error);
    },
  }
);

const response = await chat({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
});
```

### Streaming Middleware (kimicoding)

`@nakedapi/kimicoding` exports `withStreamRetry` and `withStreamFallback` for wrapping streaming calls that return `AsyncIterable`:

```typescript
import {
  kimicoding,
  withStreamRetry,
  withStreamFallback,
} from "@nakedapi/kimicoding";

const provider = kimicoding({ apiKey: process.env.KIMI_CODING_API_KEY! });

// Retry the full stream on transient failure
const stream = withStreamRetry(provider.coding.v1.messages.stream, {
  retries: 2,
  baseMs: 300,
});

for await (const chunk of stream({
  model: "k2p5",
  messages: [{ role: "user", content: "Write a haiku about TypeScript." }],
})) {
  if (chunk.delta) process.stdout.write(chunk.delta);
}
```

### Composing Middleware

Since wrappers return plain functions with the same signature, they compose naturally:

```typescript
import { kimicoding, withRetry, withFallback } from "@nakedapi/kimicoding";

const p1 = kimicoding({ apiKey: process.env.KIMI_CODING_API_KEY_1! });
const p2 = kimicoding({ apiKey: process.env.KIMI_CODING_API_KEY_2! });

// Each function retries individually, then fallback switches
const chat = withFallback([
  withRetry(p1.coding.v1.messages, { retries: 2, baseMs: 300 }),
  withRetry(p2.coding.v1.messages, { retries: 2, baseMs: 300 }),
]);

const response = await chat({
  model: "k2p5",
  messages: [{ role: "user", content: "Summarize this repo." }],
  maxTokens: 1024,
});
```

## Testing

```bash
pnpm run test:run               # Unit tests
pnpm run test:integration       # Integration tests (Polly.js replay)
pnpm run test:integration:record  # Re-record fixtures (needs API keys)
pnpm run harness                # Recording review UI at localhost:3475
```

## Development

```bash
pnpm install   # Install dependencies
pnpm run build # Build all packages
pnpm run lint  # Lint
```

## Data Shaping Exceptions

Most methods are pure pass-through — your request params are sent as-is and the API response is returned as-is. The following methods shape data on the **input** side before sending. No method shapes data on the output side.

| Transformation | Provider | Method | What happens |
|---|---|---|---|
| FormData construction | OpenAI | `v1.audio.transcriptions()` | Builds FormData from params; converts `temperature` to string |
| FormData construction | xAI | `v1.files.upload()` | Builds FormData from `file` Blob + `filename` |
| FormData construction | KIE | `api.fileStreamUpload()` | Infers MIME type from filename, generates timestamped upload path, wraps in FormData |
| Query string | Fal | `v1.models()`, `.pricing()`, `.usage()`, `.analytics()`, `.requests.byEndpoint()` | Converts param objects to URL query strings |
| Header promotion | Fal | `v1.models.requests.payloads()` | Moves `idempotency_key` from params to `Idempotency-Key` header |

## License

MIT — See [LICENSE](LICENSE)

Based on [TetherAI](https://github.com/nbursa/TetherAI) by Nenad Bursac.
