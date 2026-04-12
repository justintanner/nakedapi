# @apicity/kie

[![npm](https://img.shields.io/npm/v/@apicity/kie?color=cb0000)](https://www.npmjs.com/package/@apicity/kie)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Kie provider for video and image generation (Kling 3.0, Grok Imagine, Nano Banana Pro).

## Installation

```bash
npm install @apicity/kie
# or
pnpm add @apicity/kie
```

## Quick Start

```typescript
import { kie as createKie } from "@apicity/kie";

const kie = createKie({ apiKey: process.env.KIE_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

## Middleware

```typescript
import { kie as createKie, withRetry } from "@apicity/kie";

const kie = createKie({ apiKey: process.env.KIE_API_KEY! });
const models = withRetry(kie.get.v1.models, { retries: 3 });
```

## License

MIT
