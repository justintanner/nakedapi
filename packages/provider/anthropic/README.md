# @nakedapi/anthropic

[![npm](https://img.shields.io/npm/v/@nakedapi/anthropic?color=cb0000)](https://www.npmjs.com/package/@nakedapi/anthropic)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Anthropic provider — messages, streaming, token counting, batches, files, models, skills (beta), and organization admin APIs. Completely standalone with zero external dependencies.

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

const response = await anthropic.post.v1.messages({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(response.content[0].text);
```

## Endpoints

The Anthropic provider uses a verb-prefix pattern that mirrors HTTP methods:

```
anthropic.<verb>.v1.<path.in.camelCase>(params)
```

Base URL: `https://api.anthropic.com/v1`

### POST Endpoints

#### Messages

| URL                                  | Method Signature                                |
| ------------------------------------ | ----------------------------------------------- |
| `POST /messages`                     | `anthropic.post.v1.messages(req)`               |
| `POST /messages/count_tokens`        | `anthropic.post.v1.messages.countTokens(req)`   |
| `POST /messages/batches`             | `anthropic.post.v1.messages.batches(req)`       |
| `POST /messages/batches/{id}/cancel` | `anthropic.post.v1.messages.batches.cancel(id)` |

#### Files

| URL                       | Method Signature                |
| ------------------------- | ------------------------------- |
| `POST /files` (multipart) | `anthropic.post.v1.files(blob)` |

#### Skills (beta)

| URL                          | Method Signature                                      |
| ---------------------------- | ----------------------------------------------------- |
| `POST /skills`               | `anthropic.post.v1.skills.create(title, files)`       |
| `POST /skills/{id}/versions` | `anthropic.post.v1.skills.versions.create(id, files)` |

#### Admin — Organizations

| URL                                                    | Method Signature                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `POST /organizations/invites`                          | `anthropic.post.v1.organizations.invites.create(req)`                        |
| `POST /organizations/users/{id}`                       | `anthropic.post.v1.organizations.users.update(id, req)`                      |
| `POST /organizations/workspaces`                       | `anthropic.post.v1.organizations.workspaces.create(req)`                     |
| `POST /organizations/workspaces/{id}`                  | `anthropic.post.v1.organizations.workspaces.update(id, req)`                 |
| `POST /organizations/workspaces/{id}/archive`          | `anthropic.post.v1.organizations.workspaces.archive(id)`                     |
| `POST /organizations/workspaces/{id}/members`          | `anthropic.post.v1.organizations.workspaces.members.add(id, req)`            |
| `POST /organizations/workspaces/{id}/members/{userId}` | `anthropic.post.v1.organizations.workspaces.members.update(id, userId, req)` |
| `POST /organizations/api_keys/{id}`                    | `anthropic.post.v1.organizations.apiKeys.update(id, req)`                    |

### POST Stream Endpoints

| URL                       | Method Signature                         |
| ------------------------- | ---------------------------------------- |
| `POST /messages` (stream) | `anthropic.post.stream.v1.messages(req)` |

### GET Endpoints

#### Messages

| URL                                  | Method Signature                                 |
| ------------------------------------ | ------------------------------------------------ |
| `GET /messages/batches`              | `anthropic.get.v1.messages.batches.list()`       |
| `GET /messages/batches/{id}`         | `anthropic.get.v1.messages.batches.retrieve(id)` |
| `GET /messages/batches/{id}/results` | `anthropic.get.v1.messages.batches.results(id)`  |

#### Models

| URL                | Method Signature                       |
| ------------------ | -------------------------------------- |
| `GET /models`      | `anthropic.get.v1.models.list()`       |
| `GET /models/{id}` | `anthropic.get.v1.models.retrieve(id)` |

#### Files

| URL                       | Method Signature                      |
| ------------------------- | ------------------------------------- |
| `GET /files`              | `anthropic.get.v1.files.list()`       |
| `GET /files/{id}`         | `anthropic.get.v1.files.retrieve(id)` |
| `GET /files/{id}/content` | `anthropic.get.v1.files.content(id)`  |

#### Skills (beta)

| URL                         | Method Signature                            |
| --------------------------- | ------------------------------------------- |
| `GET /skills`               | `anthropic.get.v1.skills.list()`            |
| `GET /skills/{id}`          | `anthropic.get.v1.skills.retrieve(id)`      |
| `GET /skills/{id}/versions` | `anthropic.get.v1.skills.versions.list(id)` |

#### Admin — Organizations

| URL                                                   | Method Signature                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `GET /organizations/me`                               | `anthropic.get.v1.organizations.me()`                                    |
| `GET /organizations/users`                            | `anthropic.get.v1.organizations.users.list()`                            |
| `GET /organizations/users/{id}`                       | `anthropic.get.v1.organizations.users.retrieve(id)`                      |
| `GET /organizations/invites`                          | `anthropic.get.v1.organizations.invites.list()`                          |
| `GET /organizations/invites/{id}`                     | `anthropic.get.v1.organizations.invites.retrieve(id)`                    |
| `GET /organizations/workspaces`                       | `anthropic.get.v1.organizations.workspaces.list()`                       |
| `GET /organizations/workspaces/{id}`                  | `anthropic.get.v1.organizations.workspaces.retrieve(id)`                 |
| `GET /organizations/workspaces/{id}/members`          | `anthropic.get.v1.organizations.workspaces.members.list(id)`             |
| `GET /organizations/workspaces/{id}/members/{userId}` | `anthropic.get.v1.organizations.workspaces.members.retrieve(id, userId)` |
| `GET /organizations/api_keys`                         | `anthropic.get.v1.organizations.apiKeys.list()`                          |
| `GET /organizations/api_keys/{id}`                    | `anthropic.get.v1.organizations.apiKeys.retrieve(id)`                    |

### DELETE Endpoints

| URL                                                      | Method Signature                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `DELETE /messages/batches/{id}`                          | `anthropic.delete.v1.messages.batches.del(id)`                         |
| `DELETE /files/{id}`                                     | `anthropic.delete.v1.files.del(id)`                                    |
| `DELETE /skills/{id}`                                    | `anthropic.delete.v1.skills.del(id)`                                   |
| `DELETE /skills/{id}/versions/{version}`                 | `anthropic.delete.v1.skills.versions.del(id, version)`                 |
| `DELETE /organizations/users/{id}`                       | `anthropic.delete.v1.organizations.users.del(id)`                      |
| `DELETE /organizations/invites/{id}`                     | `anthropic.delete.v1.organizations.invites.del(id)`                    |
| `DELETE /organizations/workspaces/{id}/members/{userId}` | `anthropic.delete.v1.organizations.workspaces.members.del(id, userId)` |

## Usage Examples

### Messages

```typescript
const response = await anthropic.post.v1.messages({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Explain monads in one sentence." }],
});
```

### Streaming

```typescript
const stream = await anthropic.post.stream.v1.messages({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku about TypeScript." }],
});

for await (const event of stream) {
  if (
    event.type === "content_block_delta" &&
    event.delta.type === "text_delta"
  ) {
    process.stdout.write(event.delta.text);
  }
}
```

### Token Counting

```typescript
const result = await anthropic.post.v1.messages.countTokens({
  model: "claude-sonnet-4-20250514",
  messages: [{ role: "user", content: "Hello, world!" }],
});
console.log(result.input_tokens);
```

### Batches

```typescript
// Create a batch
const batch = await anthropic.post.v1.messages.batches({
  requests: [
    {
      custom_id: "req-1",
      params: {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Hello!" }],
      },
    },
  ],
});

// List batches
const list = await anthropic.get.v1.messages.batches.list();

// Retrieve, cancel, get results
const status = await anthropic.get.v1.messages.batches.retrieve(batch.id);
const results = await anthropic.get.v1.messages.batches.results(batch.id);
await anthropic.post.v1.messages.batches.cancel(batch.id);

// Delete batch
await anthropic.delete.v1.messages.batches.del(batch.id);
```

### Files

```typescript
// Upload a file
const file = await anthropic.post.v1.files(
  new Blob([content], { type: "text/plain" })
);

// List, retrieve, download, delete
const files = await anthropic.get.v1.files.list();
const info = await anthropic.get.v1.files.retrieve(file.id);
const contentBuffer = await anthropic.get.v1.files.content(file.id);
await anthropic.delete.v1.files.del(file.id);
```

### Models

```typescript
const models = await anthropic.get.v1.models.list();
const model = await anthropic.get.v1.models.retrieve(
  "claude-sonnet-4-20250514"
);
```

### Skills (Beta)

```typescript
// Create a skill
const skill = await anthropic.post.v1.skills.create("My Skill", [
  { path: "example.js", data: new Blob([code]) },
]);

// List skills
const skills = await anthropic.get.v1.skills.list();

// Retrieve skill
const info = await anthropic.get.v1.skills.retrieve(skill.id);

// Create skill version
const version = await anthropic.post.v1.skills.versions.create(skill.id, [
  { path: "updated.js", data: new Blob([newCode]) },
]);

// List versions
const versions = await anthropic.get.v1.skills.versions.list(skill.id);

// Delete skill and version
await anthropic.delete.v1.skills.del(skill.id);
await anthropic.delete.v1.skills.versions.del(skill.id, version.version);
```

### Admin APIs

Admin endpoints use `adminApiKey` if provided, otherwise fall back to `apiKey`.

```typescript
const admin = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  adminApiKey: process.env.ANTHROPIC_ADMIN_KEY!,
});

// Organization info
const org = await admin.get.v1.organizations.me();

// User management
const users = await admin.get.v1.organizations.users.list();
const user = await admin.get.v1.organizations.users.retrieve("user-id");
await admin.post.v1.organizations.users.update("user-id", { name: "New Name" });
await admin.delete.v1.organizations.users.del("user-id");

// Invite management
const invites = await admin.get.v1.organizations.invites.list();
const invite = await admin.post.v1.organizations.invites.create({
  email: "new@example.com",
  role: "user",
});
await admin.delete.v1.organizations.invites.del(invite.id);

// Workspace management
const workspaces = await admin.get.v1.organizations.workspaces.list();
const workspace = await admin.post.v1.organizations.workspaces.create({
  name: "Engineering",
  description: "Engineering team workspace",
});
await admin.post.v1.organizations.workspaces.update("workspace-id", {
  name: "Updated Name",
});
await admin.post.v1.organizations.workspaces.archive("workspace-id");
await admin.delete.v1.organizations.workspaces.members.del(
  "workspace-id",
  "user-id"
);

// Workspace members
const members =
  await admin.get.v1.organizations.workspaces.members.list("workspace-id");
await admin.post.v1.organizations.workspaces.members.add("workspace-id", {
  user_id: "user-id",
  role: "user",
});
await admin.post.v1.organizations.workspaces.members.update(
  "workspace-id",
  "user-id",
  {
    role: "admin",
  }
);

// API keys
const keys = await admin.get.v1.organizations.apiKeys.list();
const key = await admin.get.v1.organizations.apiKeys.retrieve("key-id");
await admin.post.v1.organizations.apiKeys.update("key-id", { name: "Updated" });
```

## Data Shaping

These endpoints transform input before sending (all others are pure pass-through):

| Method                                          | What happens                            |
| ----------------------------------------------- | --------------------------------------- |
| `post.stream.v1.messages()`                     | Sets `stream: true` in the request body |
| `post.v1.files()`                               | Builds FormData from Blob               |
| `post.v1.skills.create()`, `.versions.create()` | Builds FormData from title + file array |

## Configuration

```typescript
const anthropic = createAnthropic({
  apiKey: "your-api-key", // required
  baseURL: "https://...", // optional, custom base URL
  timeout: 30000, // optional, ms (default: 30000)
  fetch: customFetch, // optional, custom fetch implementation
  defaultVersion: "2023-06-01", // optional, anthropic-version header
  defaultBeta: ["skills-2025-10-02"], // optional, anthropic-beta header
  adminApiKey: "your-admin-key", // optional, for admin endpoints
});
```

## Middleware

```typescript
import {
  anthropic as createAnthropic,
  withRetry,
  withFallback,
} from "@nakedapi/anthropic";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Retry on transient errors (429, 5xx)
const messages = withRetry(anthropic.post.v1.messages, { retries: 3 });

// Failover across accounts
const primary = createAnthropic({ apiKey: process.env.ANTHROPIC_KEY_PRIMARY! });
const backup = createAnthropic({ apiKey: process.env.ANTHROPIC_KEY_BACKUP! });
const resilient = withFallback([
  primary.post.v1.messages,
  backup.post.v1.messages,
]);
```

## Payload Validation

All POST endpoints expose `.payloadSchema` and `.validatePayload()`:

```typescript
// Access the schema
const schema = anthropic.post.v1.messages.payloadSchema;

// Validate before sending
const result = anthropic.post.v1.messages.validatePayload({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});

if (!result.valid) {
  console.log(result.errors);
}
```

## License

MIT
