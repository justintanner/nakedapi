# @nakedapi/openai

[![npm](https://img.shields.io/npm/v/@nakedapi/openai?color=cb0000)](https://www.npmjs.com/package/@nakedapi/openai)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

OpenAI / GPT provider for chat completions.

## Installation

```bash
npm install @nakedapi/openai
# or
pnpm add @nakedapi/openai
```

## Quick Start

```typescript
import { openai as createOpenai } from "@nakedapi/openai";

const openai = createOpenai({ apiKey: process.env.OPENAI_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

### POST Endpoints

<details>
<summary>**`chat.completions`** — `POST /chat/completions`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | No | Model ID (e.g. gpt-4o) |
| `messages` | array | Yes | Array of chat messages<br>Enum: `user`, `assistant`, `system` |
| `content` | string | Yes |  |
| `temperature` | number | No | Sampling temperature 0-2 |
| `max_tokens` | number | No | Max tokens to generate |
| `max_completion_tokens` | number | No | Max completion tokens |
| `tools` | array | Yes | Tool definitions for function calling<br>Enum: `function` |
| `function` | object | Yes |  |
| `description` | string | No |  |
| `parameters` | object | No |  |
| `tool_choice` | string | No | Tool choice strategy |
| `response_format` | object | Yes | Response format configuration<br>Enum: `text`, `json_object`, `json_schema` |
| `json_schema` | object | No |  |
| `store` | boolean | No | Whether to store the completion for later retrieval |
| `metadata` | object | No | Key-value pairs for metadata (max 16 pairs, keys max 64 chars, values max 512 chars) |

**Validation:**

```typescript
// Access the schema
openai.chat.completions.payloadSchema

// Validate data
openai.chat.completions.validatePayload(data)
```

</details>

<details>
<summary>**`chat.completions.completion_id`** — `POST /chat/completions/{completion_id}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metadata` | object | Yes | Key-value pairs for metadata (max 16 pairs, keys max 64 chars, values max 512 chars) |

**Validation:**

```typescript
// Access the schema
openai.stored.completions.update.payloadSchema

// Validate data
openai.stored.completions.update.validatePayload(data)
```

</details>

<details>
<summary>**`embeddings`** — `POST /embeddings`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input` | string | Yes | Input text to embed (string, string[], number[], or number[][]) |
| `model` | string | Yes | Model ID (e.g. text-embedding-3-small) |
| `encoding_format` | string | No | Encoding format for embeddings<br>Enum: `float`, `base64` |
| `dimensions` | number | No | Number of dimensions for the output embeddings |
| `user` | string | No | Unique identifier for the end-user |

**Validation:**

```typescript
// Access the schema
openai.embeddings.payloadSchema

// Validate data
openai.embeddings.validatePayload(data)
```

</details>

<details>
<summary>**`images.edits`** — `POST /images/edits`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | object | Yes | Source image(s) to edit (Blob or Blob[]) |
| `prompt` | string | Yes | Text description of the desired edit |
| `mask` | object | No | Mask image indicating edit regions (Blob) |
| `model` | string | No | Model ID (e.g. gpt-image-1) |
| `n` | number | No | Number of images to generate (1-10) |
| `size` | string | No | Output dimensions<br>Enum: `256x256`, `512x512`, `1024x1024`, `1536x1024`, `1024x1536`, `auto` |
| `quality` | string | No | Image quality (GPT models only)<br>Enum: `standard`, `low`, `medium`, `high`, `auto` |
| `output_format` | string | No | Output image format (GPT models only)<br>Enum: `png`, `jpeg`, `webp` |
| `response_format` | string | No | Response format (DALL-E 2 only)<br>Enum: `url`, `b64_json` |
| `background` | string | No | Background transparency (GPT models only)<br>Enum: `transparent`, `opaque`, `auto` |
| `input_fidelity` | string | No | Input style fidelity (GPT models only)<br>Enum: `high`, `low` |
| `output_compression` | number | No | Compression level 0-100 (GPT models only) |
| `user` | string | No | End-user identifier for abuse monitoring |

**Validation:**

```typescript
// Access the schema
openai.image.edits.payloadSchema

// Validate data
openai.image.edits.validatePayload(data)
```

</details>

<details>
<summary>**`images.generations`** — `POST /images/generations`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the desired image(s) |
| `model` | string | No | Model ID (e.g. gpt-image-1, dall-e-3) |
| `n` | number | No | Number of images to generate (1-10) |
| `size` | string | No | Image dimensions<br>Enum: `auto`, `1024x1024`, `1536x1024`, `1024x1536`, `256x256`, `512x512`, `1792x1024`, `1024x1792` |
| `quality` | string | No | Image quality level<br>Enum: `auto`, `low`, `medium`, `high`, `standard`, `hd` |
| `response_format` | string | No | Response format (dall-e models only)<br>Enum: `url`, `b64_json` |
| `style` | string | No | Image style (dall-e-3 only)<br>Enum: `vivid`, `natural` |
| `background` | string | No | Background type (GPT image models only)<br>Enum: `transparent`, `opaque`, `auto` |
| `moderation` | string | No | Moderation level (GPT image models only)<br>Enum: `low`, `auto` |
| `output_format` | string | No | Output image format (GPT image models only)<br>Enum: `png`, `jpeg`, `webp` |
| `output_compression` | number | No | Compression level 0-100 (GPT image models only) |
| `user` | string | No | End-user identifier for abuse monitoring |

**Validation:**

```typescript
// Access the schema
openai.image.generations.payloadSchema

// Validate data
openai.image.generations.validatePayload(data)
```

</details>

<details>
<summary>**`audio.speech`** — `POST /audio/speech`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. tts-1, tts-1-hd, gpt-4o-mini-tts) |
| `input` | string | Yes | The text to generate audio for (max 4096 characters) |
| `voice` | string | Yes | The voice to use for generation<br>Enum: `alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer` |
| `response_format` | string | No | The audio output format<br>Enum: `mp3`, `opus`, `aac`, `flac`, `wav`, `pcm` |
| `speed` | number | No | The speed of the generated audio (0.25 to 4.0) |
| `instructions` | string | No | Instructions for the model to control audio generation (gpt-4o-mini-tts only) |

**Validation:**

```typescript
// Access the schema
openai.audio.speech.payloadSchema

// Validate data
openai.audio.speech.validatePayload(data)
```

</details>

<details>
<summary>**`audio.transcriptions`** — `POST /audio/transcriptions`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | Audio file (Blob) |
| `model` | string | Yes | Model ID (e.g. whisper-1) |
| `response_format` | string | No | Output format |
| `language` | string | No | ISO 639-1 language code |
| `prompt` | string | No | Optional prompt to guide model |
| `temperature` | number | No | Sampling temperature 0-1 |

**Validation:**

```typescript
// Access the schema
openai.audio.transcriptions.payloadSchema

// Validate data
openai.audio.transcriptions.validatePayload(data)
```

</details>

<details>
<summary>**`responses`** — `POST /responses`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. gpt-4o, o3-mini) |
| `input` | string | Yes | Text string or array of input items (messages, function outputs) |
| `instructions` | string | No | System/developer instructions for the model |
| `temperature` | number | No | Sampling temperature 0-2 |
| `max_output_tokens` | number | No | Maximum number of output tokens |
| `top_p` | number | No | Nucleus sampling parameter 0-1 |
| `tools` | array | Yes | Tools available to the model (function, web_search_preview, file_search, code_interpreter)<br>Enum: `function`, `web_search_preview`, `web_search_preview_2025_03_11`, `file_search`, `code_interpreter` |
| `tool_choice` | string | No | Tool choice strategy: auto, none, required, or specific tool |
| `previous_response_id` | string | No | ID of a previous response for multi-turn conversations |
| `store` | boolean | No | Whether to store the response for later retrieval |
| `metadata` | object | No | Key-value metadata pairs |
| `stream` | boolean | No | Whether to stream the response |
| `text` | object | Yes | Text generation configuration for structured output<br>Enum: `text`, `json_object`, `json_schema` |
| `verbosity` | string | No | Constrains output verbosity (low=concise, high=verbose)<br>Enum: `low`, `medium`, `high` |
| `truncation` | string | No | Truncation strategy for context window<br>Enum: `auto`, `disabled` |
| `reasoning` | object | No | Reasoning configuration for o-series and reasoning models<br>Enum: `none`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `summary` | string | No | <br>Enum: `auto`, `concise`, `detailed` |
| `user` | string | No | End-user identifier for abuse monitoring |
| `include` | array | No | Additional data to include in the response |
| `parallel_tool_calls` | boolean | No | Whether to enable parallel tool calls |
| `conversation` | string | No | Conversation ID or object associating this response with a conversation |
| `background` | boolean | No | Whether to run the model response in the background |
| `service_tier` | string | No | Processing tier for the request<br>Enum: `auto`, `default`, `flex`, `scale`, `priority` |
| `prompt` | object | Yes | Reference to a prompt template with variable substitution |
| `version` | string | No | Version of the prompt template |
| `variables` | object | No | Map of variable substitutions |
| `safety_identifier` | string | No | Stable identifier for detecting policy-violating users (max 64 chars) |
| `prompt_cache_key` | string | No | Stable identifier for caching similar requests |
| `prompt_cache_retention` | string | No | Retention policy for prompt cache<br>Enum: `in-memory`, `24h` |
| `max_tool_calls` | number | No | Maximum number of total calls to built-in tools in a response |
| `context_management` | array | Yes | Context management configuration<br>Enum: `compaction` |
| `compact_threshold` | number | No | Token threshold at which compaction is triggered |

**Validation:**

```typescript
// Access the schema
openai.responses.payloadSchema

// Validate data
openai.responses.validatePayload(data)
```

</details>

<details>
<summary>**`responses.id.cancel`** — `POST /responses/{id}/cancel`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the response to cancel |

**Validation:**

```typescript
// Access the schema
openai.responses.cancel.payloadSchema

// Validate data
openai.responses.cancel.validatePayload(data)
```

</details>

<details>
<summary>**`responses.compact`** — `POST /responses/compact`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. gpt-5, o3, gpt-4o) |
| `input` | string | No | Text string or array of input items to compact |
| `instructions` | string | No | System/developer instructions for compaction context |
| `previous_response_id` | string | No | Previous response ID for multi-turn context |
| `prompt_cache_key` | string | No | Key for reading from or writing to prompt cache |

**Validation:**

```typescript
// Access the schema
openai.responses.compact.payloadSchema

// Validate data
openai.responses.compact.validatePayload(data)
```

</details>

<details>
<summary>**`responses.input_tokens`** — `POST /responses/input_tokens`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | No | Model ID (e.g. gpt-5, o3) |
| `input` | string | No | Text string or array of input items |
| `instructions` | string | No | System/developer instructions |
| `conversation` | string | No | Conversation ID or object |
| `previous_response_id` | string | No | Previous response ID for multi-turn context |
| `tools` | array | Yes | Tools available to the model (affects token count)<br>Enum: `function`, `web_search_preview`, `web_search_preview_2025_03_11`, `file_search`, `code_interpreter` |
| `tool_choice` | string | No | Tool choice strategy: auto, none, required, or specific tool |
| `parallel_tool_calls` | boolean | No | Whether to enable parallel tool calls |
| `reasoning` | object | No | Reasoning configuration for o-series models<br>Enum: `none`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `summary` | string | No | <br>Enum: `auto`, `concise`, `detailed` |
| `text` | object | Yes | Text generation configuration<br>Enum: `text`, `json_object`, `json_schema` |
| `truncation` | string | No | Truncation strategy for context window<br>Enum: `auto`, `disabled` |

**Validation:**

```typescript
// Access the schema
openai.responses.input.tokens.payloadSchema

// Validate data
openai.responses.input.tokens.validatePayload(data)
```

</details>

<details>
<summary>**`moderations`** — `POST /moderations`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input` | string | Yes | Input text or array of text/image objects to classify for moderation |
| `model` | string | No | Moderation model ID (e.g. omni-moderation-latest, text-moderation-latest) |

**Validation:**

```typescript
// Access the schema
openai.moderations.payloadSchema

// Validate data
openai.moderations.validatePayload(data)
```

</details>

<details>
<summary>**`batches`** — `POST /batches`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input_file_id` | string | Yes | The ID of an uploaded JSONL file containing batch requests |
| `endpoint` | string | Yes | The API endpoint for all requests in the batch<br>Enum: `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions`, `/v1/responses` |
| `completion_window` | string | Yes | Time frame within which the batch should be processed<br>Enum: `24h` |
| `metadata` | object | No | Key-value pairs for storing additional information (max 16 pairs) |

**Validation:**

```typescript
// Access the schema
openai.batches.create.payloadSchema

// Validate data
openai.batches.create.validatePayload(data)
```

</details>

<details>
<summary>**`batches.batch_id.cancel`** — `POST /batches/{batch_id}/cancel`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `batch_id` | string | Yes | The ID of the batch to cancel |

**Validation:**

```typescript
// Access the schema
openai.batches.cancel.payloadSchema

// Validate data
openai.batches.cancel.validatePayload(data)
```

</details>

<details>
<summary>**`fine_tuning.jobs`** — `POST /fine_tuning/jobs`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model to fine-tune (e.g. gpt-4o-mini-2024-07-18, gpt-3.5-turbo) |
| `training_file` | string | Yes | File ID of the uploaded training data |
| `hyperparameters` | object | No | Hyperparameters (deprecated, use method instead) |
| `learning_rate_multiplier` | string | No |  |
| `n_epochs` | string | No |  |
| `integrations` | array | Yes | Integrations (e.g. WandB)<br>Enum: `wandb` |
| `wandb` | object | Yes |  |
| `entity` | string | No |  |
| `name` | string | No |  |
| `tags` | array | No |  |
| `metadata` | object | No | Up to 16 key-value pairs of metadata |
| `method` | object | Yes | Fine-tuning method configuration<br>Enum: `supervised`, `dpo`, `reinforcement` |
| `supervised` | object | No |  |
| `dpo` | object | No |  |
| `reinforcement` | object | No |  |
| `seed` | number | No | Seed for reproducibility |
| `suffix` | string | No | Up to 64 chars appended to the fine-tuned model name |
| `validation_file` | string | No | File ID of validation data |

**Validation:**

```typescript
// Access the schema
openai.fine.tuning.jobs.create.payloadSchema

// Validate data
openai.fine.tuning.jobs.create.validatePayload(data)
```

</details>

<details>
<summary>**`fine_tuning.checkpoints.checkpoint.permissions`** — `POST /fine_tuning/checkpoints/{checkpoint}/permissions`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_ids` | array | Yes | Project IDs to grant access to |

**Validation:**

```typescript
// Access the schema
openai.checkpoint.permissions.create.payloadSchema

// Validate data
openai.checkpoint.permissions.create.validatePayload(data)
```

</details>

<details>
<summary>**`files`** — `POST /files`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | The file object to upload (Blob) |
| `purpose` | string | Yes | Intended purpose of the uploaded file<br>Enum: `assistants`, `batch`, `fine-tune`, `vision`, `user_data`, `evals` |
| `expires_after` | object | Yes | Expiration policy for the file<br>Enum: `created_at` |
| `seconds` | number | Yes | Seconds after anchor time before expiry (3600-2592000) |

**Validation:**

```typescript
// Access the schema
openai.files.upload.payloadSchema

// Validate data
openai.files.upload.validatePayload(data)
```

</details>

<details>
<summary>**`audio.translations`** — `POST /audio/translations`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | Audio file (Blob) |
| `model` | string | Yes | Model ID (e.g. whisper-1) |
| `response_format` | string | No | Output format |
| `prompt` | string | No | Optional prompt to guide model (in English) |
| `temperature` | number | No | Sampling temperature 0-1 |

**Validation:**

```typescript
// Access the schema
openai.audio.translations.payloadSchema

// Validate data
openai.audio.translations.validatePayload(data)
```

</details>

### DELETE Endpoints

<details>
<summary>**`chat.completions.completion_id`** — `DELETE /chat/completions/{completion_id}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `completion_id` | string | Yes | The ID of the chat completion to delete |

**Validation:**

```typescript
// Access the schema
openai.stored.completions.delete.payloadSchema

// Validate data
openai.stored.completions.delete.validatePayload(data)
```

</details>

<details>
<summary>**`responses.id`** — `DELETE /responses/{id}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the response to delete |

**Validation:**

```typescript
// Access the schema
openai.responses.delete.payloadSchema

// Validate data
openai.responses.delete.validatePayload(data)
```

</details>

<details>
<summary>**`models.model`** — `DELETE /models/{model}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | The ID of the model to delete (must be a fine-tuned model) |

**Validation:**

```typescript
// Access the schema
openai.models.delete.payloadSchema

// Validate data
openai.models.delete.validatePayload(data)
```

</details>

<details>
<summary>**`files.file_id`** — `DELETE /files/{file_id}`</summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file_id` | string | Yes | The ID of the file to delete |

**Validation:**

```typescript
// Access the schema
openai.files.delete.payloadSchema

// Validate data
openai.files.delete.validatePayload(data)
```

</details>

## Middleware

```typescript
import { openai as createOpenai, withRetry } from "@nakedapi/openai";

const openai = createOpenai({ apiKey: process.env.OPENAI_API_KEY! });
const models = withRetry(openai.get.v1.models, { retries: 3 });
```

## License

MIT
