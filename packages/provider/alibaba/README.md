# @apicity/alibaba

[![npm](https://img.shields.io/npm/v/@apicity/alibaba?color=cb0000)](https://www.npmjs.com/package/@apicity/alibaba)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Alibaba Cloud Model Studio provider for chat completions and streaming.

## Installation

```bash
npm install @apicity/alibaba
# or
pnpm add @apicity/alibaba
```

## Quick Start

```typescript
import { alibaba as createAlibaba } from "@apicity/alibaba";

const alibaba = createAlibaba({ apiKey: process.env.ALIBABA_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

## Middleware

```typescript
import { alibaba as createAlibaba, withRetry } from "@apicity/alibaba";

const alibaba = createAlibaba({ apiKey: process.env.ALIBABA_API_KEY! });
const models = withRetry(alibaba.get.v1.models, { retries: 3 });
```

## License

MIT
