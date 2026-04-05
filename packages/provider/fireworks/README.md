# @nakedapi/fireworks

[![npm](https://img.shields.io/npm/v/@nakedapi/fireworks?color=cb0000)](https://www.npmjs.com/package/@nakedapi/fireworks)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](tsconfig.json)

Fireworks AI provider for chat completions, completions, and embeddings.

## Installation

```bash
npm install @nakedapi/fireworks
# or
pnpm add @nakedapi/fireworks
```

## Quick Start

```typescript
import { fireworks as createFireworks } from "@nakedapi/fireworks";

const fireworks = createFireworks({ apiKey: process.env.FIREWORKS_API_KEY! });
```

## API Reference

All methods include their payload schema and a `validatePayload()` function for runtime validation.

### GET Endpoints

<details>
<summary><b><code>v1.audio.transcriptions.streaming</code></b> — <code>GET /v1/audio/transcriptions/streaming</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `language` | string | No | Language code (e.g. en, fr, ja) |
| `prompt` | string | No | Context hint for transcription |
| `temperature` | number | No | Sampling temperature for token decoding |
| `response_format` | string | No | Response format (only verbose_json for streaming)<br>Enum: `verbose_json` |
| `timestamp_granularities` | array | No | Timestamp granularity (word, segment)<br>Enum: `word`, `segment` |

**Validation:**

```typescript
// Access the schema
fireworks.audio.streaming.transcriptions.payloadSchema

// Validate data
fireworks.audio.streaming.transcriptions.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.models</code></b> — <code>GET /v1/accounts/{account_id}/models</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pageSize` | number | No | Maximum number of models to return (max 200) |
| `pageToken` | string | No | Pagination token from a previous list response |
| `filter` | string | No | Google AIP-160 filter expression |
| `orderBy` | string | No | Comma-separated fields for ordering |
| `readMask` | string | No |  |

**Validation:**

```typescript
// Access the schema
fireworks.models.list.payloadSchema

// Validate data
fireworks.models.list.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.models.model_id</code></b> — <code>GET /v1/accounts/{account_id}/models/{model_id}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `readMask` | string | No |  |

**Validation:**

```typescript
// Access the schema
fireworks.models.get.payloadSchema

// Validate data
fireworks.models.get.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.models.model_id:getDownloadEndpoint</code></b> — <code>GET /v1/accounts/{account_id}/models/{model_id}:getDownloadEndpoint</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `readMask` | string | No | Fields to return |

**Validation:**

```typescript
// Access the schema
fireworks.models.get.download.endpoint.payloadSchema

// Validate data
fireworks.models.get.download.endpoint.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.models.model_id:validateUpload</code></b> — <code>GET /v1/accounts/{account_id}/models/{model_id}:validateUpload</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `skipHfConfigValidation` | boolean | No | Skip HuggingFace config validation |
| `trustRemoteCode` | boolean | No | Trust remote code |
| `configOnly` | boolean | No | Skip tokenizer and parameter name validation |

**Validation:**

```typescript
// Access the schema
fireworks.models.validate.upload.payloadSchema

// Validate data
fireworks.models.validate.upload.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.datasets.dataset_id:getDownloadEndpoint</code></b> — <code>GET /v1/accounts/{account_id}/datasets/{dataset_id}:getDownloadEndpoint</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `readMask` | string | No | Fields to return |
| `downloadLineage` | boolean | No | Download entire lineage chain with dataset ID prefixed filenames |

**Validation:**

```typescript
// Access the schema
fireworks.datasets.get.download.endpoint.payloadSchema

// Validate data
fireworks.datasets.get.download.endpoint.validatePayload(data)
```

</details>

### POST Endpoints

<details>
<summary><b><code>chat.completions</code></b> — <code>POST /chat/completions</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. accounts/fireworks/models/llama-v3p1-70b-instruct) |
| `messages` | array | Yes | Array of chat messages<br>Enum: `user`, `assistant`, `system` |
| `content` | string | Yes |  |
| `temperature` | number | No | Sampling temperature 0-2 |
| `top_p` | number | No | Nucleus sampling 0-1 |
| `top_k` | number | No | Top-k token filtering 0-100 |
| `max_tokens` | number | No | Max tokens to generate |
| `max_completion_tokens` | number | No | Max completion tokens |
| `n` | number | No | Number of completions to generate |
| `stop` | string | No | Stop sequences (string or array, up to 4) |
| `stream` | boolean | No | Enable streaming |
| `tools` | array | Yes | Tool definitions for function calling<br>Enum: `function` |
| `function` | object | Yes |  |
| `description` | string | No |  |
| `parameters` | object | No |  |
| `tool_choice` | string | No | Tool choice strategy |
| `response_format` | object | Yes | Response format configuration<br>Enum: `text`, `json_object`, `json_schema`, `grammar` |
| `json_schema` | object | No |  |
| `grammar` | object | No |  |
| `frequency_penalty` | number | No | Frequency penalty -2 to 2 |
| `presence_penalty` | number | No | Presence penalty -2 to 2 |
| `logprobs` | boolean | No | Include log probabilities |
| `top_logprobs` | number | No | Top token alternatives 0-5 |
| `reasoning_effort` | string | No | Reasoning effort level<br>Enum: `low`, `medium`, `high`, `none` |
| `user` | string | No | End-user identifier for abuse monitoring |

**Validation:**

```typescript
// Access the schema
fireworks.chat.completions.payloadSchema

// Validate data
fireworks.chat.completions.validatePayload(data)
```

</details>

<details>
<summary><b><code>completions</code></b> — <code>POST /completions</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID |
| `prompt` | string | Yes | Prompt to generate completions for (string, string[], number[], or number[][]) |
| `max_tokens` | number | No | Max tokens to generate |
| `max_completion_tokens` | number | No | Max completion tokens |
| `temperature` | number | No | Sampling temperature 0-2 |
| `top_p` | number | No | Nucleus sampling 0-1 |
| `top_k` | number | No | Top-k token filtering 0-100 |
| `n` | number | No | Number of completions to generate (1-128) |
| `stop` | string | No | Stop sequences (string or array, up to 4) |
| `stream` | boolean | No | Enable streaming |
| `echo` | boolean | No | Include prompt in response |
| `echo_last` | number | No | Echo last N prompt tokens |
| `frequency_penalty` | number | No | Frequency penalty -2 to 2 |
| `presence_penalty` | number | No | Presence penalty -2 to 2 |
| `repetition_penalty` | number | No | Repetition penalty 0-2 |
| `logprobs` | boolean | No | Include log probabilities |
| `top_logprobs` | number | No | Top token alternatives 0-5 |
| `response_format` | object | Yes | Response format configuration<br>Enum: `text`, `json_object`, `json_schema`, `grammar` |
| `json_schema` | object | No |  |
| `grammar` | object | No |  |
| `reasoning_effort` | string | No | Reasoning effort level<br>Enum: `low`, `medium`, `high`, `none` |
| `seed` | number | No | Random seed for deterministic sampling |
| `user` | string | No | End-user identifier for abuse monitoring |

**Validation:**

```typescript
// Access the schema
fireworks.completions.payloadSchema

// Validate data
fireworks.completions.validatePayload(data)
```

</details>

<details>
<summary><b><code>rerank</code></b> — <code>POST /rerank</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Reranker model ID (e.g. fireworks/qwen3-reranker-8b) |
| `query` | string | Yes | The search query to rerank documents against |
| `documents` | array | Yes | List of document strings to be ranked |
| `top_n` | number | No | Number of top results to return |
| `return_documents` | boolean | No | Whether to include document text in the response |

**Validation:**

```typescript
// Access the schema
fireworks.rerank.payloadSchema

// Validate data
fireworks.rerank.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.messages</code></b> — <code>POST /v1/messages</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model ID (e.g. accounts/fireworks/models/llama-v3p1-70b-instruct) |
| `messages` | array | Yes | Array of messages (Anthropic Messages format)<br>Enum: `user`, `assistant` |
| `content` | string | Yes |  |
| `max_tokens` | number | No | Maximum tokens to generate |
| `system` | string | No | System prompt |
| `temperature` | number | No | Sampling temperature 0-1 |
| `top_p` | number | No | Nucleus sampling threshold |
| `top_k` | number | No | Top-K sampling |
| `stop_sequences` | array | No | Custom stop sequences |
| `stream` | boolean | No | Enable SSE streaming |
| `metadata` | object | No | Request metadata |
| `thinking` | object | Yes | Extended thinking configuration<br>Enum: `enabled`, `disabled` |
| `budget_tokens` | number | No |  |
| `tools` | array | Yes | Tool definitions |
| `description` | string | No |  |
| `input_schema` | object | Yes |  |
| `tool_choice` | object | Yes | Tool choice strategy<br>Enum: `auto`, `any`, `none`, `tool` |
| `name` | string | No |  |
| `raw_output` | boolean | No | Return raw model output details (Fireworks extension) |

**Validation:**

```typescript
// Access the schema
fireworks.messages.payloadSchema

// Validate data
fireworks.messages.validatePayload(data)
```

</details>

<details>
<summary><b><code>audio.transcriptions</code></b> — <code>POST /audio/transcriptions</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | Audio file (Blob) or public URL string |
| `model` | string | No | ASR model (whisper-v3 or whisper-v3-turbo)<br>Enum: `whisper-v3`, `whisper-v3-turbo` |
| `vad_model` | string | No | Voice activity detection model<br>Enum: `silero`, `whisperx-pyannet` |
| `alignment_model` | string | No | Alignment model for timestamps<br>Enum: `mms_fa`, `tdnn_ffn` |
| `language` | string | No | Target language code |
| `prompt` | string | No | Custom prompt for style or vocabulary |
| `temperature` | number | No | Sampling temperature 0-1 |
| `response_format` | string | No | Output format<br>Enum: `json`, `text`, `srt`, `verbose_json`, `vtt` |
| `timestamp_granularities` | string | No | Timestamp detail level (word, segment, or both) |
| `diarize` | string | No | Enable speaker diarization<br>Enum: `true`, `false` |
| `min_speakers` | number | No | Minimum speaker count for diarization |
| `max_speakers` | number | No | Maximum speaker count for diarization |
| `preprocessing` | string | No | Audio preprocessing mode<br>Enum: `none`, `dynamic`, `soft_dynamic`, `bass_dynamic` |

**Validation:**

```typescript
// Access the schema
fireworks.audio.transcriptions.payloadSchema

// Validate data
fireworks.audio.transcriptions.validatePayload(data)
```

</details>

<details>
<summary><b><code>audio.translations</code></b> — <code>POST /audio/translations</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | object | Yes | Audio file (Blob) or public URL string |
| `model` | string | No | ASR model (whisper-v3 or whisper-v3-turbo)<br>Enum: `whisper-v3`, `whisper-v3-turbo` |
| `vad_model` | string | No | Voice activity detection model<br>Enum: `silero`, `whisperx-pyannet` |
| `alignment_model` | string | No | Alignment model for timestamps<br>Enum: `mms_fa`, `tdnn_ffn` |
| `language` | string | No | Source language code |
| `prompt` | string | No | Custom prompt for style or vocabulary |
| `temperature` | number | No | Sampling temperature 0-1 |
| `response_format` | string | No | Output format<br>Enum: `json`, `text`, `srt`, `verbose_json`, `vtt` |
| `timestamp_granularities` | string | No | Timestamp detail level (word, segment, or both) |
| `preprocessing` | string | No | Audio preprocessing mode<br>Enum: `none`, `dynamic`, `soft_dynamic`, `bass_dynamic` |

**Validation:**

```typescript
// Access the schema
fireworks.audio.translations.payloadSchema

// Validate data
fireworks.audio.translations.validatePayload(data)
```

</details>

<details>
<summary><b><code>workflows.accounts.fireworks.models.model.text_to_image</code></b> — <code>POST /workflows/accounts/fireworks/models/{model}/text_to_image</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text prompt for image generation |
| `aspect_ratio` | string | No | Image aspect ratio<br>Enum: `1:1`, `21:9`, `16:9`, `3:2`, `5:4`, `4:5`, `2:3`, `9:16`, `9:21`, `4:3`, `3:4` |
| `guidance_scale` | number | No | Classifier-free guidance scale (default 3.5) |
| `num_inference_steps` | number | No | Number of denoising steps (default 4) |
| `seed` | number | No | Random seed (0 = random) |

**Validation:**

```typescript
// Access the schema
fireworks.text.to.image.payloadSchema

// Validate data
fireworks.text.to.image.validatePayload(data)
```

</details>

<details>
<summary><b><code>workflows.accounts.fireworks.models.model</code></b> — <code>POST /workflows/accounts/fireworks/models/{model}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text prompt for image generation or editing |
| `input_image` | string | No | Base64-encoded image or URL for image-to-image editing |
| `seed` | number | No | Seed for reproducibility (default 42) |
| `aspect_ratio` | string | No | Aspect ratio (range 21:9 to 9:21) |
| `output_format` | string | No | Output image format<br>Enum: `png`, `jpeg` |
| `webhook_url` | string | No | URL for webhook notifications |
| `webhook_secret` | string | No | Secret for webhook signature verification |
| `prompt_upsampling` | boolean | No | Auto-modify prompt for creative generation |
| `safety_tolerance` | number | No | Moderation level 0-6 (0=strictest) |

**Validation:**

```typescript
// Access the schema
fireworks.kontext.payloadSchema

// Validate data
fireworks.kontext.validatePayload(data)
```

</details>

<details>
<summary><b><code>workflows.accounts.fireworks.models.model.get_result</code></b> — <code>POST /workflows/accounts/fireworks/models/{model}/get_result</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Request ID from the create request |

**Validation:**

```typescript
// Access the schema
fireworks.get.result.payloadSchema

// Validate data
fireworks.get.result.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.models</code></b> — <code>POST /v1/accounts/{account_id}/models</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `modelId` | string | Yes | ID for the new model |
| `model` | object | Yes | Model properties |
| `cluster` | string | No | BYOC cluster resource name |

**Validation:**

```typescript
// Access the schema
fireworks.models.create.payloadSchema

// Validate data
fireworks.models.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.models.model_id:prepare</code></b> — <code>POST /v1/accounts/{account_id}/models/{model_id}:prepare</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `precision` | string | Yes | Target deployment precision |
| `readMask` | string | No | Fields to return |

**Validation:**

```typescript
// Access the schema
fireworks.models.prepare.payloadSchema

// Validate data
fireworks.models.prepare.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.models.model_id:getUploadEndpoint</code></b> — <code>POST /v1/accounts/{account_id}/models/{model_id}:getUploadEndpoint</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filenameToSize` | object | Yes | Mapping of filename to size in bytes |
| `enableResumableUpload` | boolean | No | Enable resumable upload |
| `readMask` | string | No | Fields to return |

**Validation:**

```typescript
// Access the schema
fireworks.models.get.upload.endpoint.payloadSchema

// Validate data
fireworks.models.get.upload.endpoint.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.batchInferenceJobs</code></b> — <code>POST /v1/accounts/{account_id}/batchInferenceJobs</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model resource name (e.g. accounts/fireworks/models/llama-v3p1-8b-instruct) |
| `inputDatasetId` | string | Yes |  |
| `displayName` | string | No | Human-readable display name for the job |
| `outputDatasetId` | string | No | Output dataset resource name |
| `inferenceParameters` | object | No | Inference parameters for the batch job |
| `temperature` | number | No | Sampling temperature (0-2) |
| `topP` | number | No | Top-p sampling (0-1) |
| `n` | number | No | Number of response candidates per input |
| `topK` | number | No | Top-k token selection limit |
| `extraBody` | string | No | Additional parameters as JSON string |
| `precision` | string | No | Model precision (e.g. FP16, FP8) |
| `continuedFromJobName` | string | No | Resource name of a previous job to continue from |

**Validation:**

```typescript
// Access the schema
fireworks.batch.inference.job.create.payloadSchema

// Validate data
fireworks.batch.inference.job.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.supervisedFineTuningJobs</code></b> — <code>POST /v1/accounts/{account_id}/supervisedFineTuningJobs</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accountId` | string | Yes | Fireworks account ID |
| `dataset` | string | Yes | Training dataset name |
| `displayName` | string | No | Display name for the job |
| `baseModel` | string | No | Base model to fine-tune (mutually exclusive with warmStartFrom) |
| `warmStartFrom` | string | No | PEFT addon model to fine-tune from (mutually exclusive with baseModel) |
| `outputModel` | string | No | Model ID for the output; defaults to job ID |
| `jinjaTemplate` | string | No | Jinja template for conversation formatting |
| `epochs` | number | No | Number of training epochs |
| `learningRate` | number | No | Training learning rate |
| `maxContextLength` | number | No | Maximum context length |
| `loraRank` | number | No | LoRA layer rank |
| `earlyStop` | boolean | No | Stop early if validation loss does not improve |
| `evaluationDataset` | string | No | Separate evaluation dataset |
| `isTurbo` | boolean | No | Enable turbo mode |
| `evalAutoCarveout` | boolean | No | Auto-carve dataset for evaluation |
| `region` | string | No | Execution region |
| `nodes` | number | No | Number of compute nodes |
| `batchSize` | number | No | Batch size for sequence packing |
| `batchSizeSamples` | number | No | Number of samples per gradient batch |
| `gradientAccumulationSteps` | number | No | Gradient accumulation steps |
| `learningRateWarmupSteps` | number | No | Learning rate warm-up steps |
| `mtpEnabled` | boolean | No | Enable Model-Token-Prediction mode |
| `mtpNumDraftTokens` | number | No | Number of draft tokens in MTP mode |
| `mtpFreezeBaseModel` | boolean | No | Freeze base model during MTP training |
| `optimizerWeightDecay` | number | No | Weight decay (L2 regularization) |
| `usePurpose` | string | No |  |
| `awsS3Config` | object | No | AWS S3 access configuration |
| `iamRoleArn` | string | No | IAM role ARN for S3 via GCP OIDC |
| `azureBlobStorageConfig` | object | No | Azure Blob Storage configuration |
| `managedIdentityClientId` | string | No | Managed Identity Client ID |
| `tenantId` | string | No | Azure tenant ID (UUID) |
| `wandbConfig` | object | No | Weights & Biases logging configuration |
| `apiKey` | string | No | Wandb API key |
| `project` | string | No | Wandb project name |
| `entity` | string | No | Wandb entity name |
| `runId` | string | No | Wandb run identifier |
| `supervisedFineTuningJobId` | string | No | Client-specified job ID; system generates UUID if omitted |

**Validation:**

```typescript
// Access the schema
fireworks.sft.create.payloadSchema

// Validate data
fireworks.sft.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.deployments</code></b> — <code>POST /v1/accounts/{account_id}/deployments</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `baseModel` | string | Yes | Model name (e.g. accounts/fireworks/models/llama-v3p1-70b-instruct) |
| `displayName` | string | No | Human-readable name, max 64 chars |
| `description` | string | No | Deployment description |
| `minReplicaCount` | number | No | Minimum replicas (default: 0) |
| `maxReplicaCount` | number | No | Maximum replicas |
| `acceleratorCount` | number | No | Accelerators per replica |
| `acceleratorType` | string | No | GPU/accelerator type<br>Enum: `ACCELERATOR_TYPE_UNSPECIFIED`, `NVIDIA_A100_80GB`, `NVIDIA_H100_80GB`, `AMD_MI300X_192GB`, `NVIDIA_A10G_24GB`, `NVIDIA_A100_40GB`, `NVIDIA_L4_24GB`, `NVIDIA_H200_141GB`, `NVIDIA_B200_180GB`, `AMD_MI325X_256GB`, `AMD_MI350X_288GB` |
| `precision` | string | No | Serving precision<br>Enum: `PRECISION_UNSPECIFIED`, `FP16`, `FP8`, `FP8_MM`, `BF16`, `NF4`, `FP4` |
| `enableAddons` | boolean | No | Enable PEFT addons |
| `draftTokenCount` | number | No | Speculative decoding tokens per step |
| `draftModel` | string | No | Draft model for speculative decoding |
| `maxContextLength` | number | No | Context window (0 = model default) |
| `deploymentShape` | string | No | Deployment shape name |

**Validation:**

```typescript
// Access the schema
fireworks.create.deployment.payloadSchema

// Validate data
fireworks.create.deployment.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.audio.transcriptions</code></b> — <code>POST /v1/audio/transcriptions</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | string | Yes | Audio file to transcribe (Blob or URL string) |
| `endpoint_id` | string | Yes | Batch endpoint identifier |
| `model` | string | No | Whisper model ID (e.g. whisper-v3, whisper-v3-turbo) |
| `vad_model` | string | No | Voice activity detection model<br>Enum: `silero`, `whisperx-pyannet` |
| `alignment_model` | string | No | Forced alignment model<br>Enum: `mms_fa`, `tdnn_ffn` |
| `language` | string | No | ISO-639-1 language code |
| `prompt` | string | No | Optional text prompt to guide transcription |
| `temperature` | number | No | Sampling temperature (0-1) |
| `response_format` | string | No | Output format<br>Enum: `json`, `text`, `srt`, `verbose_json`, `vtt` |
| `timestamp_granularities` | string | No | Timestamp detail level (segment, word) |
| `diarize` | string | No | Enable speaker diarization<br>Enum: `true`, `false` |
| `min_speakers` | number | No | Minimum number of speakers for diarization |
| `max_speakers` | number | No | Maximum number of speakers for diarization |
| `preprocessing` | string | No | Audio preprocessing mode<br>Enum: `none`, `dynamic`, `soft_dynamic`, `bass_dynamic` |

**Validation:**

```typescript
// Access the schema
fireworks.audio.batch.transcriptions.payloadSchema

// Validate data
fireworks.audio.batch.transcriptions.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.audio.translations</code></b> — <code>POST /v1/audio/translations</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | string | Yes | Audio file to translate (Blob or URL string) |
| `endpoint_id` | string | Yes | Batch endpoint identifier |
| `model` | string | No | Whisper model ID (e.g. whisper-v3, whisper-v3-turbo) |
| `vad_model` | string | No | Voice activity detection model<br>Enum: `silero`, `whisperx-pyannet` |
| `alignment_model` | string | No | Forced alignment model<br>Enum: `mms_fa`, `tdnn_ffn` |
| `language` | string | No | ISO-639-1 source language code |
| `prompt` | string | No | Optional text prompt to guide translation |
| `temperature` | number | No | Sampling temperature (0-1) |
| `response_format` | string | No | Output format<br>Enum: `json`, `text`, `srt`, `verbose_json`, `vtt` |
| `timestamp_granularities` | string | No | Timestamp detail level (segment, word) |
| `preprocessing` | string | No | Audio preprocessing mode<br>Enum: `none`, `dynamic`, `soft_dynamic`, `bass_dynamic` |

**Validation:**

```typescript
// Access the schema
fireworks.audio.batch.translations.payloadSchema

// Validate data
fireworks.audio.batch.translations.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.dpoJobs</code></b> — <code>POST /v1/accounts/{account_id}/dpoJobs</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dataset` | string | Yes |  |
| `displayName` | string | No | Human-readable display name for the job |
| `trainingConfig` | object | No | Training configuration |
| `warmStartFrom` | string | No | PEFT addon model (mutually exclusive with baseModel) |
| `outputModel` | string | No | Resulting model ID |
| `learningRate` | number | No | Training learning rate |
| `epochs` | number | No | Number of training iterations |
| `batchSize` | number | No | Max tokens per batch |
| `maxContextLength` | number | No | Model context window size |
| `loraRank` | number | No | LoRA layer rank (0 for service-mode) |
| `jinjaTemplate` | string | No | Conversation format Jinja2 template |
| `region` | string | No | Training region |
| `lossConfig` | object | No | Reinforcement learning loss configuration<br>Enum: `METHOD_UNSPECIFIED`, `GRPO`, `DAPO`, `DPO`, `ORPO`, `GSPO_TOKEN` |
| `klBeta` | number | No | KL coefficient (beta) override |
| `wandbConfig` | object | No | Weights & Biases integration config |
| `apiKey` | string | No | W&B API key |
| `project` | string | No | W&B project name |
| `entity` | string | No | W&B entity/team name |
| `runId` | string | No | W&B run ID |
| `awsS3Config` | object | No | AWS S3 configuration for dataset storage |
| `iamRoleArn` | string | No | AWS IAM role ARN for GCP federation |
| `azureBlobStorageConfig` | object | No | Azure Blob Storage configuration |
| `managedIdentityClientId` | string | No | Managed identity client UUID |
| `tenantId` | string | No | Azure tenant UUID |

**Validation:**

```typescript
// Access the schema
fireworks.dpo.job.create.payloadSchema

// Validate data
fireworks.dpo.job.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.accountId.users</code></b> — <code>POST /v1/accounts/{accountId}/users</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | Yes | User role<br>Enum: `admin`, `user`, `contributor`, `inference-user` |
| `displayName` | string | No | Display name, max 64 chars |
| `email` | string | No | User email address |
| `serviceAccount` | boolean | No | Whether this is a service account (admin-only) |

**Validation:**

```typescript
// Access the schema
fireworks.create.user.payloadSchema

// Validate data
fireworks.create.user.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.accountId.users.userId.apiKeys</code></b> — <code>POST /v1/accounts/{accountId}/users/{userId}/apiKeys</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `apiKey` | object | Yes | API key properties |
| `expireTime` | string | No | Optional expiration timestamp (RFC3339) |

**Validation:**

```typescript
// Access the schema
fireworks.create.api.key.payloadSchema

// Validate data
fireworks.create.api.key.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.evaluatorsV2</code></b> — <code>POST /v1/accounts/{account_id}/evaluatorsV2</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `evaluatorId` | string | No | Client-chosen evaluator ID |
| `evaluator` | object | Yes | Evaluator configuration |
| `description` | string | No | Criterion description |
| `requirements` | string | No | Contents for requirements.txt |
| `entryPoint` | string | No | Entry point (format: module::function or path::function) |
| `commitHash` | string | No | Git commit hash |
| `defaultDataset` | string | No | Default dataset resource name |
| `criteria` | array | No | Evaluation criteria<br>Enum: `TYPE_UNSPECIFIED`, `CODE_SNIPPETS` |
| `name` | string | No | Criterion name |
| `codeSnippets` | object | No | Code snippets configuration |
| `fileContents` | object | No | Map of filename to code content |
| `entryFile` | string | No | Entry file name |
| `entryFunc` | string | No | Entry function name |
| `source` | object | No | Evaluator source configuration<br>Enum: `TYPE_UNSPECIFIED`, `TYPE_UPLOAD`, `TYPE_GITHUB`, `TYPE_TEMPORARY` |
| `githubRepositoryName` | string | No | GitHub repository (format: owner/repository) |

**Validation:**

```typescript
// Access the schema
fireworks.create.evaluator.payloadSchema

// Validate data
fireworks.create.evaluator.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.datasets</code></b> — <code>POST /v1/accounts/{account_id}/datasets</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dataset` | object | Yes | Dataset configuration object |
| `datasetId` | string | Yes | Identifier for the dataset |
| `sourceDatasetId` | string | No | Create by filtering an existing dataset |
| `filter` | string | No | SQL-like WHERE clause for source dataset filtering |

**Validation:**

```typescript
// Access the schema
fireworks.datasets.create.payloadSchema

// Validate data
fireworks.datasets.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.accountId.users.userId.apiKeys:delete</code></b> — <code>POST /v1/accounts/{accountId}/users/{userId}/apiKeys:delete</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keyId` | string | Yes | The key ID of the API key to delete |

**Validation:**

```typescript
// Access the schema
fireworks.delete.api.key.payloadSchema

// Validate data
fireworks.delete.api.key.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.accountId.secrets</code></b> — <code>POST /v1/accounts/{accountId}/secrets</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keyName` | string | Yes | Name of the key (e.g. WOLFRAM_ALPHA_API_KEY) |
| `value` | string | Yes | Secret value (INPUT_ONLY, never returned in GET/LIST) |
| `name` | string | No |  |

**Validation:**

```typescript
// Access the schema
fireworks.create.secret.payloadSchema

// Validate data
fireworks.create.secret.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.evaluators.evaluator_id:getUploadEndpoint</code></b> — <code>POST /v1/accounts/{account_id}/evaluators/{evaluator_id}:getUploadEndpoint</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filenameToSize` | object | Yes | Map of filename to file size |
| `readMask` | string | No | Field mask for response |

**Validation:**

```typescript
// Access the schema
fireworks.get.upload.endpoint.evaluator.payloadSchema

// Validate data
fireworks.get.upload.endpoint.evaluator.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.evaluationJobs</code></b> — <code>POST /v1/accounts/{account_id}/evaluationJobs</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `evaluationJobId` | string | No | Client-chosen evaluation job ID |
| `leaderboardIds` | array | No | Leaderboard IDs to attach the job to |
| `evaluationJob` | object | Yes | Evaluation job configuration |
| `evaluator` | string | Yes |  |
| `inputDataset` | string | Yes |  |
| `outputDataset` | string | Yes |  |
| `outputStats` | string | No | Aggregated stats output |
| `awsS3Config` | object | No | AWS S3 configuration |
| `iamRoleArn` | string | No | AWS IAM role ARN |

**Validation:**

```typescript
// Access the schema
fireworks.create.evaluation.job.payloadSchema

// Validate data
fireworks.create.evaluation.job.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.datasets.dataset_id:getUploadEndpoint</code></b> — <code>POST /v1/accounts/{account_id}/datasets/{dataset_id}:getUploadEndpoint</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filenameToSize` | object | Yes | Mapping of filename to size in bytes |
| `readMask` | string | No | Fields to return |

**Validation:**

```typescript
// Access the schema
fireworks.datasets.get.upload.endpoint.payloadSchema

// Validate data
fireworks.datasets.get.upload.endpoint.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.reinforcementFineTuningJobs</code></b> — <code>POST /v1/accounts/{account_id}/reinforcementFineTuningJobs</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dataset` | string | Yes |  |
| `evaluator` | string | Yes | Evaluator resource for RLOR fine-tuning |
| `displayName` | string | No | Human-readable display name for the job |
| `trainingConfig` | object | No | Training configuration |
| `warmStartFrom` | string | No | PEFT addon model (mutually exclusive with baseModel) |
| `outputModel` | string | No | Resulting model ID |
| `learningRate` | number | No | Training learning rate |
| `epochs` | number | No | Number of training iterations |
| `batchSize` | number | No | Max tokens per batch |
| `maxContextLength` | number | No | Model context window size |
| `loraRank` | number | No | LoRA layer rank (0 for service-mode) |
| `jinjaTemplate` | string | No | Conversation format Jinja2 template |
| `region` | string | No | Training region |
| `inferenceParams` | object | No | Inference parameters for RL rollouts |
| `temperature` | number | No | Sampling temperature |
| `topP` | number | No | Top-p (nucleus) sampling |
| `topK` | number | No | Top-k sampling |
| `lossConfig` | object | No | Reinforcement learning loss configuration<br>Enum: `METHOD_UNSPECIFIED`, `GRPO`, `DAPO`, `DPO`, `ORPO`, `GSPO_TOKEN` |
| `klBeta` | number | No | KL coefficient (beta) override |
| `wandbConfig` | object | No | Weights & Biases integration config |
| `apiKey` | string | No | W&B API key |
| `project` | string | No | W&B project name |
| `entity` | string | No | W&B entity/team name |
| `runId` | string | No | W&B run ID |
| `awsS3Config` | object | No | AWS S3 configuration for dataset storage |
| `iamRoleArn` | string | No | AWS IAM role ARN for GCP federation |
| `azureBlobStorageConfig` | object | No | Azure Blob Storage configuration |
| `managedIdentityClientId` | string | No | Managed identity client UUID |
| `tenantId` | string | No | Azure tenant UUID |

**Validation:**

```typescript
// Access the schema
fireworks.rft.create.payloadSchema

// Validate data
fireworks.rft.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.rlorTrainerJobs</code></b> — <code>POST /v1/accounts/{account_id}/rlorTrainerJobs</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dataset` | string | Yes |  |
| `evaluator` | string | Yes | Evaluator resource for RLOR fine-tuning |
| `displayName` | string | No | Human-readable display name for the trainer job |
| `trainingConfig` | object | No | Training configuration |
| `warmStartFrom` | string | No | PEFT addon model (mutually exclusive with baseModel) |
| `outputModel` | string | No | Resulting model ID |
| `learningRate` | number | No | Training learning rate |
| `epochs` | number | No | Number of training iterations |
| `batchSize` | number | No | Max tokens per batch |
| `maxContextLength` | number | No | Model context window size |
| `loraRank` | number | No | LoRA layer rank (0 for service-mode) |
| `jinjaTemplate` | string | No | Conversation format Jinja2 template |
| `region` | string | No | Training region |
| `inferenceParams` | object | No | Inference parameters for RL rollouts |
| `temperature` | number | No | Sampling temperature |
| `topP` | number | No | Top-p (nucleus) sampling |
| `topK` | number | No | Top-k sampling |
| `lossConfig` | object | No | Reinforcement learning loss configuration<br>Enum: `METHOD_UNSPECIFIED`, `GRPO`, `DAPO`, `DPO`, `ORPO`, `GSPO_TOKEN` |
| `klBeta` | number | No | KL coefficient (beta) override |
| `rewardWeights` | array | No | Reward weight configurations for RL training |
| `weight` | number | No | Reward weight multiplier |
| `wandbConfig` | object | No | Weights & Biases integration config |
| `apiKey` | string | No | W&B API key |
| `project` | string | No | W&B project name |
| `entity` | string | No | W&B entity/team name |
| `runId` | string | No | W&B run ID |
| `awsS3Config` | object | No | AWS S3 configuration for dataset storage |
| `iamRoleArn` | string | No | AWS IAM role ARN for GCP federation |
| `azureBlobStorageConfig` | object | No | Azure Blob Storage configuration |
| `managedIdentityClientId` | string | No | Managed identity client UUID |
| `tenantId` | string | No | Azure tenant UUID |

**Validation:**

```typescript
// Access the schema
fireworks.rlor.trainer.job.create.payloadSchema

// Validate data
fireworks.rlor.trainer.job.create.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.datasets.dataset_id:validateUpload</code></b> — <code>POST /v1/accounts/{account_id}/datasets/{dataset_id}:validateUpload</code></summary>

**Validation:**

```typescript
// Access the schema
fireworks.datasets.validate.upload.payloadSchema

// Validate data
fireworks.datasets.validate.upload.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.rlorTrainerJobs.job_id:executeTrainStep</code></b> — <code>POST /v1/accounts/{account_id}/rlorTrainerJobs/{job_id}:executeTrainStep</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dataset` | string | Yes | Dataset to process for this iteration |
| `outputModel` | string | Yes | Output model to materialize when training completes |

**Validation:**

```typescript
// Access the schema
fireworks.rlor.trainer.job.execute.step.payloadSchema

// Validate data
fireworks.rlor.trainer.job.execute.step.validatePayload(data)
```

</details>

<details>
<summary><b><code>embeddings</code></b> — <code>POST /embeddings</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Embedding model ID (e.g. nomic-ai/nomic-embed-text-v1.5) |
| `input` | string | Yes | Input text to embed (string, string[], number[], or number[][]) |
| `dimensions` | number | No | Output embedding dimensionality |
| `prompt_template` | string | No | Jinja2 template for processing structured input |
| `return_logits` | array | No | Token indices for raw logits output |
| `normalize` | boolean | No | Enable L2 normalization for embeddings or softmax for logits |

**Validation:**

```typescript
// Access the schema
fireworks.embeddings.payloadSchema

// Validate data
fireworks.embeddings.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.deployedModels</code></b> — <code>POST /v1/accounts/{account_id}/deployedModels</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model resource name (e.g. accounts/my-account/models/my-lora) |
| `deployment` | string | Yes | Base deployment resource name (e.g. accounts/my-account/deployments/my-deployment) |
| `displayName` | string | No | Human-readable display name |
| `description` | string | No | Description of the deployed model |
| `default` | boolean | No | If true, default target when querying without #<deployment> suffix |
| `serverless` | boolean | No | Whether to deploy as serverless (not applicable for LoRA) |
| `public` | boolean | No | Whether the deployed model is publicly reachable |

**Validation:**

```typescript
// Access the schema
fireworks.create.deployed.model.payloadSchema

// Validate data
fireworks.create.deployed.model.validatePayload(data)
```

</details>

### DELETE Endpoints

<details>
<summary><b><code>v1.accounts.account_id.models.model_id</code></b> — <code>DELETE /v1/accounts/{account_id}/models/{model_id}</code></summary>

**Validation:**

```typescript
// Access the schema
fireworks.models.delete.payloadSchema

// Validate data
fireworks.models.delete.validatePayload(data)
```

</details>

### PATCH Endpoints

<details>
<summary><b><code>v1.accounts.account_id.models.model_id</code></b> — <code>PATCH /v1/accounts/{account_id}/models/{model_id}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `displayName` | string | No | Display name (max 64 chars) |
| `description` | string | No | Model description (max 1000 chars) |
| `kind` | string | No | Model kind |
| `public` | boolean | No | Whether the model is publicly accessible |
| `contextLength` | number | No | Context length in tokens |
| `supportsImageInput` | boolean | No | Whether the model supports image input |
| `supportsTools` | boolean | No | Whether the model supports tool use |

**Validation:**

```typescript
// Access the schema
fireworks.models.update.payloadSchema

// Validate data
fireworks.models.update.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.deployments.deployment_id</code></b> — <code>PATCH /v1/accounts/{account_id}/deployments/{deployment_id}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `baseModel` | string | No | Model name |
| `displayName` | string | No | Human-readable name, max 64 chars |
| `description` | string | No | Deployment description |
| `minReplicaCount` | number | No | Minimum replicas |
| `maxReplicaCount` | number | No | Maximum replicas |
| `acceleratorCount` | number | No | Accelerators per replica |
| `acceleratorType` | string | No | GPU/accelerator type<br>Enum: `ACCELERATOR_TYPE_UNSPECIFIED`, `NVIDIA_A100_80GB`, `NVIDIA_H100_80GB`, `AMD_MI300X_192GB`, `NVIDIA_A10G_24GB`, `NVIDIA_A100_40GB`, `NVIDIA_L4_24GB`, `NVIDIA_H200_141GB`, `NVIDIA_B200_180GB`, `AMD_MI325X_256GB`, `AMD_MI350X_288GB` |
| `precision` | string | No | Serving precision<br>Enum: `PRECISION_UNSPECIFIED`, `FP16`, `FP8`, `FP8_MM`, `BF16`, `NF4`, `FP4` |
| `enableAddons` | boolean | No | Enable PEFT addons |
| `maxContextLength` | number | No | Context window (0 = model default) |
| `deploymentShape` | string | No | Deployment shape name |

**Validation:**

```typescript
// Access the schema
fireworks.update.deployment.payloadSchema

// Validate data
fireworks.update.deployment.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.deployments.deployment_id:scale</code></b> — <code>PATCH /v1/accounts/{account_id}/deployments/{deployment_id}:scale</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `replicaCount` | number | Yes | Desired number of replicas |

**Validation:**

```typescript
// Access the schema
fireworks.scale.deployment.payloadSchema

// Validate data
fireworks.scale.deployment.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.accountId.users.userId</code></b> — <code>PATCH /v1/accounts/{accountId}/users/{userId}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | Yes | User role<br>Enum: `admin`, `user`, `contributor`, `inference-user` |
| `displayName` | string | No | Display name, max 64 chars |
| `email` | string | No | User email address |
| `serviceAccount` | boolean | No | Whether this is a service account (admin-only) |

**Validation:**

```typescript
// Access the schema
fireworks.update.user.payloadSchema

// Validate data
fireworks.update.user.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.accountId.secrets.secretId</code></b> — <code>PATCH /v1/accounts/{accountId}/secrets/{secretId}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keyName` | string | Yes | Key name |
| `value` | string | No | New secret value (INPUT_ONLY) |

**Validation:**

```typescript
// Access the schema
fireworks.update.secret.payloadSchema

// Validate data
fireworks.update.secret.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.evaluators.evaluator_id</code></b> — <code>PATCH /v1/accounts/{account_id}/evaluators/{evaluator_id}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `displayName` | string | No | Human-readable display name |
| `description` | string | No | Criterion description |
| `requirements` | string | No | Contents for requirements.txt |
| `entryPoint` | string | No | Entry point (format: module::function or path::function) |
| `commitHash` | string | No | Git commit hash |
| `defaultDataset` | string | No | Default dataset resource name |
| `criteria` | array | No | Evaluation criteria<br>Enum: `TYPE_UNSPECIFIED`, `CODE_SNIPPETS` |
| `name` | string | No | Criterion name |
| `source` | object | No | Evaluator source configuration<br>Enum: `TYPE_UNSPECIFIED`, `TYPE_UPLOAD`, `TYPE_GITHUB`, `TYPE_TEMPORARY` |
| `githubRepositoryName` | string | No | GitHub repository (format: owner/repository) |

**Validation:**

```typescript
// Access the schema
fireworks.update.evaluator.payloadSchema

// Validate data
fireworks.update.evaluator.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.datasets.dataset_id</code></b> — <code>PATCH /v1/accounts/{account_id}/datasets/{dataset_id}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `displayName` | string | No | User-friendly display name |
| `exampleCount` | number | No | Number of examples in the dataset |
| `externalUrl` | string | No | External dataset URI (e.g. gs://bucket/path.jsonl) |
| `format` | string | No | Dataset format<br>Enum: `FORMAT_UNSPECIFIED`, `CHAT`, `COMPLETION`, `RL` |
| `sourceJobName` | string | No | Resource name of originating job |

**Validation:**

```typescript
// Access the schema
fireworks.datasets.update.payloadSchema

// Validate data
fireworks.datasets.update.validatePayload(data)
```

</details>

<details>
<summary><b><code>v1.accounts.account_id.deployedModels.deployed_model_id</code></b> — <code>PATCH /v1/accounts/{account_id}/deployedModels/{deployed_model_id}</code></summary>

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `displayName` | string | No | Human-readable display name |
| `description` | string | No | Description of the deployed model |
| `model` | string | No | Model resource name |
| `deployment` | string | No | Base deployment resource name |
| `default` | boolean | No | If true, default target when querying without #<deployment> suffix |
| `serverless` | boolean | No | Whether to deploy as serverless |
| `public` | boolean | No | Whether the deployed model is publicly reachable |

**Validation:**

```typescript
// Access the schema
fireworks.update.deployed.model.payloadSchema

// Validate data
fireworks.update.deployed.model.validatePayload(data)
```

</details>

## Middleware

```typescript
import { fireworks as createFireworks, withRetry } from "@nakedapi/fireworks";

const fireworks = createFireworks({ apiKey: process.env.FIREWORKS_API_KEY! });
const models = withRetry(fireworks.get.v1.models, { retries: 3 });
```

## License

MIT
