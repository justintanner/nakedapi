# @apicity/openai

[![npm](https://img.shields.io/npm/v/@apicity/openai?color=cb0000)](https://www.npmjs.com/package/@apicity/openai)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

OpenAI / GPT provider for chat completions.

## Installation

```bash
npm install @apicity/openai
# or
pnpm add @apicity/openai
```

## Quick Start

```typescript
import { openai as createOpenai } from "@apicity/openai";

const openai = createOpenai({ apiKey: process.env.OPENAI_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

## Middleware

```typescript
import { openai as createOpenai, withRetry } from "@apicity/openai";

const openai = createOpenai({ apiKey: process.env.OPENAI_API_KEY! });
const models = withRetry(openai.get.v1.models, { retries: 3 });
```

## License

MIT
