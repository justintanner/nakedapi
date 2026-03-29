import type { PayloadSchema } from "./types";

export const chatCompletionsSchema: PayloadSchema = {
  method: "POST",
  path: "/chat/completions",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model ID (e.g. mistral-large-latest)",
    },
    messages: {
      type: "array",
      required: true,
      description: "Array of chat messages",
      items: {
        type: "object",
        properties: {
          role: {
            type: "string",
            required: true,
            enum: ["user", "assistant", "system", "tool"],
          },
          content: { type: "string", required: true },
        },
      },
    },
    temperature: { type: "number", description: "Sampling temperature 0-1" },
    max_tokens: { type: "number", description: "Max tokens to generate" },
    top_p: { type: "number", description: "Nucleus sampling parameter" },
    random_seed: { type: "number", description: "Random seed for sampling" },
    stream: { type: "boolean", description: "Whether to stream the response" },
    safe_prompt: {
      type: "boolean",
      description: "Inject a safety prompt before messages",
    },
    tools: {
      type: "array",
      description: "Tool definitions for function calling",
      items: {
        type: "object",
        properties: {
          type: { type: "string", required: true, enum: ["function"] },
          function: {
            type: "object",
            required: true,
            properties: {
              name: { type: "string", required: true },
              description: { type: "string" },
              parameters: { type: "object" },
            },
          },
        },
      },
    },
    tool_choice: {
      type: "string",
      description: "Tool choice strategy",
      enum: ["auto", "none", "any", "required"],
    },
    response_format: {
      type: "object",
      description: "Response format configuration",
      properties: {
        type: {
          type: "string",
          required: true,
          enum: ["text", "json_object"],
        },
      },
    },
    stop: { type: "string", description: "Stop sequence(s)" },
    presence_penalty: {
      type: "number",
      description: "Presence penalty -2 to 2",
    },
    frequency_penalty: {
      type: "number",
      description: "Frequency penalty -2 to 2",
    },
    n: {
      type: "number",
      description: "Number of chat completions to generate",
    },
  },
};

export const fimCompletionsSchema: PayloadSchema = {
  method: "POST",
  path: "/fim/completions",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model ID (e.g. codestral-latest)",
    },
    prompt: {
      type: "string",
      required: true,
      description: "The text before the cursor",
    },
    suffix: {
      type: "string",
      description: "The text after the cursor",
    },
    temperature: { type: "number", description: "Sampling temperature" },
    max_tokens: { type: "number", description: "Max tokens to generate" },
    top_p: { type: "number", description: "Nucleus sampling" },
    random_seed: { type: "number", description: "Random seed" },
    stream: { type: "boolean", description: "Stream the response" },
    stop: { type: "string", description: "Stop sequence(s)" },
    min_tokens: { type: "number", description: "Minimum tokens to generate" },
  },
};

export const embeddingsSchema: PayloadSchema = {
  method: "POST",
  path: "/embeddings",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model ID (e.g. mistral-embed)",
    },
    input: {
      type: "string",
      required: true,
      description: "Text to embed (string or array of strings)",
    },
    encoding_format: {
      type: "string",
      description: "Encoding format",
      enum: ["float"],
    },
  },
};

export const ocrSchema: PayloadSchema = {
  method: "POST",
  path: "/ocr",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "OCR model ID (e.g. mistral-ocr-latest)",
    },
    document: {
      type: "object",
      required: true,
      description: "Document source to process",
      properties: {
        type: {
          type: "string",
          required: true,
          enum: ["document_url", "image_url", "base64"],
        },
        document_url: { type: "string" },
        image_url: { type: "string" },
        data: { type: "string" },
      },
    },
    id: { type: "string", description: "Request ID" },
    pages: {
      type: "array",
      description: "Page indices to process",
      items: { type: "number" },
    },
    include_image_base64: {
      type: "boolean",
      description: "Include base64-encoded images",
    },
    image_limit: { type: "number", description: "Max images to extract" },
    image_min_size: {
      type: "number",
      description: "Minimum image size in pixels",
    },
  },
};

export const moderationsSchema: PayloadSchema = {
  method: "POST",
  path: "/moderations",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      description: "Model ID for moderation",
    },
    input: {
      type: "string",
      required: true,
      description: "Text to moderate (string or array of strings)",
    },
  },
};

export const chatModerationsSchema: PayloadSchema = {
  method: "POST",
  path: "/chat/moderations",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      description: "Model ID for moderation",
    },
    input: {
      type: "array",
      required: true,
      description: "Chat messages to moderate",
      items: {
        type: "object",
        properties: {
          role: { type: "string", required: true },
          content: { type: "string", required: true },
        },
      },
    },
  },
};

export const classificationsSchema: PayloadSchema = {
  method: "POST",
  path: "/classifications",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model ID for classification",
    },
    input: {
      type: "string",
      required: true,
      description: "Text to classify",
    },
  },
};

export const chatClassificationsSchema: PayloadSchema = {
  method: "POST",
  path: "/chat/classifications",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model ID for classification",
    },
    input: {
      type: "array",
      required: true,
      description: "Chat messages to classify",
      items: {
        type: "object",
        properties: {
          role: { type: "string", required: true },
          content: { type: "string", required: true },
        },
      },
    },
  },
};

export const fineTuningJobsCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/fine_tuning/jobs",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Base model to fine-tune",
    },
    training_files: {
      type: "array",
      required: true,
      description: "Training file references",
      items: {
        type: "object",
        properties: {
          file_id: { type: "string", required: true },
          weight: { type: "number" },
        },
      },
    },
    validation_files: {
      type: "array",
      description: "Validation file IDs",
      items: { type: "string" },
    },
    hyperparameters: {
      type: "object",
      description: "Training hyperparameters",
      properties: {
        training_steps: { type: "number" },
        learning_rate: { type: "number" },
        weight_decay: { type: "number" },
        warmup_fraction: { type: "number" },
        epochs: { type: "number" },
        fim_ratio: { type: "number" },
        seq_len: { type: "number" },
      },
    },
    suffix: { type: "string", description: "Fine-tuned model name suffix" },
    integrations: {
      type: "array",
      description: "External integrations (e.g. WandB)",
      items: {
        type: "object",
        properties: {
          type: { type: "string", required: true, enum: ["wandb"] },
          project: { type: "string", required: true },
          name: { type: "string" },
          api_key: { type: "string" },
          run_name: { type: "string" },
        },
      },
    },
    auto_start: {
      type: "boolean",
      description: "Auto-start after validation",
    },
  },
};

export const fineTuningModelUpdateSchema: PayloadSchema = {
  method: "PATCH",
  path: "/fine_tuning/models/{model_id}",
  contentType: "application/json",
  fields: {
    name: { type: "string", description: "Updated model name" },
    description: { type: "string", description: "Updated description" },
  },
};

export const batchJobsCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/batch/jobs",
  contentType: "application/json",
  fields: {
    input_files: {
      type: "array",
      required: true,
      description: "Input file IDs",
      items: { type: "string" },
    },
    endpoint: {
      type: "string",
      required: true,
      description: "Target endpoint (e.g. /v1/chat/completions)",
    },
    model: {
      type: "string",
      required: true,
      description: "Model to use",
    },
    metadata: {
      type: "object",
      description: "Key-value metadata",
    },
    timeout_hours: {
      type: "number",
      description: "Timeout in hours",
    },
  },
};

export const speechSchema: PayloadSchema = {
  method: "POST",
  path: "/audio/speech",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "TTS model ID",
    },
    input: {
      type: "string",
      required: true,
      description: "Text to speak",
    },
    voice_id: {
      type: "string",
      description: "Voice ID to use",
    },
    ref_audio: {
      type: "string",
      description: "Base64-encoded reference audio for zero-shot cloning",
    },
    response_format: {
      type: "string",
      description: "Audio output format",
      enum: ["pcm", "wav", "mp3", "flac", "opus"],
    },
    speed: { type: "number", description: "Speech speed" },
    stream: { type: "boolean", description: "Stream the response" },
    language: { type: "string", description: "Language code" },
  },
};

export const transcriptionsSchema: PayloadSchema = {
  method: "POST",
  path: "/audio/transcriptions",
  contentType: "multipart/form-data",
  fields: {
    file: {
      type: "string",
      required: true,
      description: "Audio file to transcribe",
    },
    model: {
      type: "string",
      required: true,
      description: "Transcription model ID",
    },
    language: { type: "string", description: "Language code" },
    prompt: { type: "string", description: "Optional prompt context" },
    response_format: {
      type: "string",
      description: "Response format",
      enum: ["json", "text", "srt", "verbose_json", "vtt"],
    },
    temperature: { type: "number", description: "Sampling temperature" },
  },
};

export const voiceCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/audio/voices",
  contentType: "application/json",
  fields: {
    name: {
      type: "string",
      required: true,
      description: "Voice name",
    },
    sample: {
      type: "string",
      required: true,
      description: "Base64-encoded audio sample",
    },
    gender: { type: "string", description: "Voice gender" },
    languages: {
      type: "array",
      description: "Supported languages",
      items: { type: "string" },
    },
    age: { type: "string", description: "Voice age" },
    tags: {
      type: "array",
      description: "Voice tags",
      items: { type: "string" },
    },
  },
};

export const voiceUpdateSchema: PayloadSchema = {
  method: "PATCH",
  path: "/audio/voices/{voice_id}",
  contentType: "application/json",
  fields: {
    name: { type: "string", description: "Updated voice name" },
    gender: { type: "string", description: "Updated gender" },
    languages: {
      type: "array",
      description: "Updated languages",
      items: { type: "string" },
    },
    age: { type: "string", description: "Updated age" },
    tags: {
      type: "array",
      description: "Updated tags",
      items: { type: "string" },
    },
  },
};

export const agentCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/agents",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model to use for the agent",
    },
    name: { type: "string", description: "Agent name" },
    description: { type: "string", description: "Agent description" },
    instructions: { type: "string", description: "Agent instructions" },
    tools: {
      type: "array",
      description: "Tools available to the agent",
      items: {
        type: "object",
        properties: {
          type: { type: "string", required: true },
          function: { type: "object" },
        },
      },
    },
    completion_args: { type: "object", description: "Completion arguments" },
  },
};

export const agentCompletionsSchema: PayloadSchema = {
  method: "POST",
  path: "/agents/completions",
  contentType: "application/json",
  fields: {
    agent_id: {
      type: "string",
      required: true,
      description: "Agent ID",
    },
    messages: {
      type: "array",
      required: true,
      description: "Messages for the agent",
      items: {
        type: "object",
        properties: {
          role: { type: "string", required: true },
          content: { type: "string", required: true },
        },
      },
    },
    max_tokens: { type: "number", description: "Max tokens" },
    stream: { type: "boolean", description: "Stream response" },
  },
};

export const conversationCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/conversations",
  contentType: "application/json",
  fields: {
    agent_id: {
      type: "string",
      required: true,
      description: "Agent ID for the conversation",
    },
    inputs: {
      type: "array",
      required: true,
      description: "Initial messages",
      items: {
        type: "object",
        properties: {
          role: { type: "string", required: true },
          content: { type: "string", required: true },
        },
      },
    },
    stream: { type: "boolean", description: "Stream response" },
    store: { type: "boolean", description: "Store conversation" },
  },
};

export const conversationAppendSchema: PayloadSchema = {
  method: "POST",
  path: "/conversations/{conversation_id}",
  contentType: "application/json",
  fields: {
    inputs: {
      type: "array",
      required: true,
      description: "Messages to append",
      items: {
        type: "object",
        properties: {
          role: { type: "string", required: true },
          content: { type: "string", required: true },
        },
      },
    },
    stream: { type: "boolean", description: "Stream response" },
  },
};

export const conversationRestartSchema: PayloadSchema = {
  method: "POST",
  path: "/conversations/{conversation_id}/restart",
  contentType: "application/json",
  fields: {},
};

export const libraryCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/libraries",
  contentType: "application/json",
  fields: {
    name: {
      type: "string",
      required: true,
      description: "Library name",
    },
    description: { type: "string", description: "Library description" },
    embedding_model: {
      type: "string",
      description: "Embedding model for the library",
    },
    chunking_strategy: {
      type: "string",
      description: "Document chunking strategy",
    },
  },
};
