# @nakedapi/anthropic

[![npm](https://img.shields.io/npm/v/@nakedapi/anthropic?color=cb0000)](https://www.npmjs.com/package/@nakedapi/anthropic)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Anthropic / Claude provider for messages, batches, models, files, and admin APIs.

## Installation

```bash
npm install @nakedapi/anthropic
# or
pnpm add @nakedapi/anthropic
```

## Quick Start

```typescript
import { anthropic as createAnthropic } from "@nakedapi/anthropic";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

### POST Endpoints

<details>
<summary><b><code>messages</code></b> — <code>POST /messages</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. claude-sonnet-4-6) |
| `max_tokens` | number | Yes | Maximum output tokens |
| `messages` | array | Yes | Array of messages<br>Enum: `user`, `assistant` |
| `content` | string | Yes |  |
| `system` | string | No | System prompt |
| `temperature` | number | No | Sampling temperature 0-1 |
| `top_p` | number | No | Nucleus sampling |
| `top_k` | number | No | Top-K sampling |
| `stop_sequences` | array | No | Custom stop sequences |
| `stream` | boolean | No | Enable SSE streaming |
| `tools` | array | No | Tool definitions |
| `tool_choice` | object | No | Tool choice configuration<br>Enum: `auto`, `any`, `tool`, `none` |
| `name` | string | No |  |
| `thinking` | object | No | Extended thinking configuration<br>Enum: `enabled`, `disabled`, `adaptive` |
| `budget_tokens` | number | No |  |
| `metadata` | object | No | Request metadata |
| `service_tier` | string | No | <br>Enum: `auto`, `standard_only` |

**Validation:**

```typescript
// Access the schema
anthropic.messages.payloadSchema

// Validate data
anthropic.messages.validatePayload(data)
```

</details>

<details>
<summary><b><code>messages.count_tokens</code></b> — <code>POST /messages/count_tokens</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID |
| `messages` | array | Yes | Array of messages<br>Enum: `user`, `assistant` |
| `content` | string | Yes |  |
| `system` | string | No | System prompt |
| `tools` | array | No | Tool definitions |

**Validation:**

```typescript
// Access the schema
anthropic.count.tokens.payloadSchema

// Validate data
anthropic.count.tokens.validatePayload(data)
```

</details>

<details>
<summary><b><code>messages.batches</code></b> — <code>POST /messages/batches</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requests` | array | Yes | Array of batch requests (max 100,000) |
| `params` | object | Yes |  |

**Validation:**

```typescript
// Access the schema
anthropic.batches.create.payloadSchema

// Validate data
anthropic.batches.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>files</code></b> — <code>POST /files</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | File to upload |

**Validation:**

```typescript
// Access the schema
anthropic.files.upload.payloadSchema

// Validate data
anthropic.files.upload.validatePayload(data)
```

</details>

<details>
<summary><b><code>organizations.invites</code></b> — <code>POST /organizations/invites</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address to invite |
| `role` | string | Yes | Role for the invited user<br>Enum: `user`, `developer`, `billing`, `claude_code_user`, `managed` |

**Validation:**

```typescript
// Access the schema
anthropic.invite.create.payloadSchema

// Validate data
anthropic.invite.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>organizations.workspaces</code></b> — <code>POST /organizations/workspaces</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Workspace name |
| `data_residency` | object | No | Data residency configuration |

**Validation:**

```typescript
// Access the schema
anthropic.workspace.create.payloadSchema

// Validate data
anthropic.workspace.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>skills</code></b> — <code>POST /skills</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `display_title` | string | Yes | Human-readable skill title |
| `files` | array | Yes | Skill files (must include SKILL.md) |

**Validation:**

```typescript
// Access the schema
anthropic.skills.create.payloadSchema

// Validate data
anthropic.skills.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>skills.skill_id.versions</code></b> — <code>POST /skills/{skill_id}/versions</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | array | Yes | Updated skill files (must include SKILL.md) |

**Validation:**

```typescript
// Access the schema
anthropic.skill.versions.create.payloadSchema

// Validate data
anthropic.skill.versions.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>organizations.workspaces.workspace_id.members</code></b> — <code>POST /organizations/workspaces/{workspace_id}/members</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | User ID to add |
| `workspace_role` | string | Yes | Role in workspace<br>Enum: `workspace_user`, `workspace_developer`, `workspace_admin` |

**Validation:**

```typescript
// Access the schema
anthropic.workspace.member.add.payloadSchema

// Validate data
anthropic.workspace.member.add.validatePayload(data)
```

</details>

## Middleware

```typescript
import { anthropic as createAnthropic, withRetry } from "@nakedapi/anthropic";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const models = withRetry(anthropic.get.v1.models, { retries: 3 });
```

## License

MIT
