# @apicity/fal

[![npm](https://img.shields.io/npm/v/@apicity/fal?color=cb0000)](https://www.npmjs.com/package/@apicity/fal)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Fal Platform API provider for model management, pricing, usage, and analytics.

## Installation

```bash
npm install @apicity/fal
# or
pnpm add @apicity/fal
```

## Quick Start

```typescript
import { fal as createFal } from "@apicity/fal";

const fal = createFal({ apiKey: process.env.FAL_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

## Middleware

```typescript
import { fal as createFal, withRetry } from "@apicity/fal";

const fal = createFal({ apiKey: process.env.FAL_API_KEY! });
const models = withRetry(fal.get.v1.models, { retries: 3 });
```

## License

MIT
