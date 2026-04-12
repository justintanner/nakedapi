# @apicity/free

[![npm](https://img.shields.io/npm/v/@apicity/free?color=cb0000)](https://www.npmjs.com/package/@apicity/free)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Free file hosting providers — tmpfiles.org and file.io.

## Installation

```bash
npm install @apicity/free
# or
pnpm add @apicity/free
```

## Quick Start

```typescript
import { free as createFree } from "@apicity/free";

const free = createFree({ apiKey: process.env.FREE_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

## Middleware

```typescript
import { free as createFree, withRetry } from "@apicity/free";

const free = createFree({ apiKey: process.env.FREE_API_KEY! });
const models = withRetry(free.get.v1.models, { retries: 3 });
```

## License

MIT
