# @apicity/anthropic

[![npm](https://img.shields.io/npm/v/@apicity/anthropic?color=cb0000)](https://www.npmjs.com/package/@apicity/anthropic)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Anthropic / Claude provider for messages, batches, models, files, and admin APIs.

## Installation

```bash
npm install @apicity/anthropic
# or
pnpm add @apicity/anthropic
```

## Quick Start

```typescript
import { anthropic as createAnthropic } from "@apicity/anthropic";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

## Middleware

```typescript
import { anthropic as createAnthropic, withRetry } from "@apicity/anthropic";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const models = withRetry(anthropic.get.v1.models, { retries: 3 });
```

## License

MIT
