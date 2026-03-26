import type { PayloadSchema } from "./types";

export const createTaskSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/jobs/createTask",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model ID (discriminator for input shape)",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    input: {
      type: "object",
      required: true,
      description: "Model-specific input parameters",
    },
  },
};

export const downloadUrlSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/common/download-url",
  contentType: "application/json",
  fields: {
    url: {
      type: "string",
      required: true,
      description: "Kie CDN URL to convert to a temporary download link",
    },
  },
};

export const fileStreamUploadSchema: PayloadSchema = {
  method: "POST",
  path: "/api/file-stream-upload",
  contentType: "multipart/form-data",
  fields: {
    file: {
      type: "object",
      required: true,
      description: "File to upload (Blob)",
    },
    filename: {
      type: "string",
      required: true,
      description: "Filename with extension",
    },
    mimeType: { type: "string", description: "MIME type override" },
  },
};

export const veoGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/veo/generate",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Text prompt for video generation",
    },
    model: {
      type: "string",
      enum: ["veo3", "veo3_fast"],
      description: "Veo model variant",
    },
    aspectRatio: {
      type: "string",
      enum: ["16:9", "9:16", "Auto"],
      description: "Output aspect ratio",
    },
    generationType: {
      type: "string",
      enum: [
        "TEXT_2_VIDEO",
        "REFERENCE_2_VIDEO",
        "FIRST_AND_LAST_FRAMES_2_VIDEO",
      ],
      description: "Generation mode",
    },
    imageUrls: {
      type: "array",
      description: "Reference image URLs",
      items: { type: "string" },
    },
    seeds: { type: "number", description: "Random seed" },
    watermark: { type: "string", description: "Watermark text" },
    enableTranslation: {
      type: "boolean",
      description: "Enable prompt translation",
    },
  },
};

export const veoExtendSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/veo/extend",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID of the video to extend",
    },
    prompt: {
      type: "string",
      required: true,
      description: "Text prompt for extension",
    },
    model: {
      type: "string",
      enum: ["fast", "quality"],
      description: "Extension quality mode",
    },
    seeds: { type: "number", description: "Random seed" },
    watermark: { type: "string", description: "Watermark text" },
  },
};

export const sunoGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Text prompt or lyrics",
    },
    model: {
      type: "string",
      required: true,
      enum: ["V4", "V4_5", "V4_5PLUS", "V4_5ALL", "V5"],
      description: "Suno model version",
    },
    instrumental: {
      type: "boolean",
      required: true,
      description: "Generate instrumental (no vocals)",
    },
    customMode: {
      type: "boolean",
      required: true,
      description: "Enable custom mode",
    },
    style: { type: "string", description: "Music style/genre" },
    negativeTags: {
      type: "string",
      description: "Styles to avoid",
    },
    title: { type: "string", description: "Song title" },
  },
};

export const chatCompletionsSchema: PayloadSchema = {
  method: "POST",
  path: "/gpt-5-2/v1/chat/completions",
  contentType: "application/json",
  fields: {
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
            enum: ["user", "assistant", "system"],
          },
          content: { type: "string", required: true },
        },
      },
    },
    temperature: { type: "number", description: "Sampling temperature" },
    max_tokens: { type: "number", description: "Max tokens to generate" },
    stream: { type: "boolean", description: "Enable streaming" },
    response_format: {
      type: "object",
      description: "Response format configuration",
      properties: {
        type: {
          type: "string",
          required: true,
          enum: ["text", "json_object", "json_schema"],
        },
        json_schema: { type: "object" },
      },
    },
  },
};
