# @apicity/xai

[![npm](https://img.shields.io/npm/v/@apicity/xai?color=cb0000)](https://www.npmjs.com/package/@apicity/xai)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

X.AI / Grok provider for chat and search.

## Installation

```bash
npm install @apicity/xai
# or
pnpm add @apicity/xai
```

## Quick Start

```typescript
import { xai as createXai } from "@apicity/xai";

const xai = createXai({ apiKey: process.env.XAI_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

## Middleware

```typescript
import { xai as createXai, withRetry } from "@apicity/xai";

const xai = createXai({ apiKey: process.env.XAI_API_KEY! });
const models = withRetry(xai.get.v1.models, { retries: 3 });
```

## Rate Limiting

Client-side rate limiting that queues requests to stay within xAI API limits.

```typescript
import {
  xai as createXai,
  withRateLimit,
  withRetry,
  createRateLimiter,
  XAI_RATE_LIMITS,
} from "@apicity/xai";

const xai = createXai({ apiKey: process.env.XAI_API_KEY! });
```

### Using xAI tier presets

```typescript
// Use built-in tier presets (free, tier1, tier2, tier3, tier4)
const limiter = createRateLimiter(XAI_RATE_LIMITS.tier1);
// => { rpm: 60, concurrent: 10 }

const chat = withRateLimit(xai.post.v1.chat.completions, limiter);
```

### Custom limits

```typescript
const limiter = createRateLimiter({ rpm: 30, concurrent: 5 });
const chat = withRateLimit(xai.post.v1.chat.completions, limiter);
```

### Shared limiter across endpoints

RPM limits apply globally, so share a single limiter across all endpoints:

```typescript
const limiter = createRateLimiter(XAI_RATE_LIMITS.tier2);

const chat = withRateLimit(xai.post.v1.chat.completions, limiter);
const responses = withRateLimit(xai.post.v1.responses, limiter);
const images = withRateLimit(xai.post.v1.images.generations, limiter);
```

### Composing with retry

Place `withRateLimit` innermost so retries count against the limit:

```typescript
const limiter = createRateLimiter(XAI_RATE_LIMITS.tier1);

const chat = withRetry(
  withRateLimit(xai.post.v1.chat.completions, limiter),
  { retries: 2 }
);
```

### Batch processing

Fire requests in parallel — the limiter handles pacing automatically:

```typescript
const limiter = createRateLimiter(XAI_RATE_LIMITS.tier1);
const chat = withRateLimit(xai.post.v1.chat.completions, limiter);

const results = await Promise.all(
  prompts.map((p) =>
    chat({
      model: "grok-3",
      messages: [{ role: "user", content: p }],
    })
  )
);
```

### xAI rate limit tiers

| Preset | RPM | Concurrent | Spend threshold |
|--------|-----|------------|-----------------|
| `free` | 5 | 2 | $0 |
| `tier1` | 60 | 10 | $0+ |
| `tier2` | 200 | 25 | $100+ |
| `tier3` | 500 | 50 | $500+ |
| `tier4` | 1000 | 100 | $1,000+ |

## License

MIT
