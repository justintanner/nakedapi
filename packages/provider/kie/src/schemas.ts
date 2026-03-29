import type { PayloadSchema, KieMediaModel, ModelInputSchema } from "./types";

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

export const fileUrlUploadSchema: PayloadSchema = {
  method: "POST",
  path: "/api/file-url-upload",
  contentType: "application/json",
  fields: {
    url: {
      type: "string",
      required: true,
      description: "Remote URL of the file to upload",
    },
    uploadPath: {
      type: "string",
      description: "Destination path (auto-generated if omitted)",
    },
  },
};

export const fileBase64UploadSchema: PayloadSchema = {
  method: "POST",
  path: "/api/file-base64-upload",
  contentType: "application/json",
  fields: {
    base64: {
      type: "string",
      required: true,
      description: "Base64-encoded file data",
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

const sunoModelEnum = [
  "V4",
  "V4_5",
  "V4_5PLUS",
  "V4_5ALL",
  "V5",
  "V5_5",
] as const;

const sunoMixFields: Record<string, import("./types").PayloadFieldSchema> = {
  vocalGender: {
    type: "string",
    enum: ["m", "f"],
    description: "Vocal gender",
  },
  styleWeight: {
    type: "number",
    description: "Style weight (0-1)",
  },
  weirdnessConstraint: {
    type: "number",
    description: "Weirdness constraint (0-1)",
  },
  audioWeight: {
    type: "number",
    description: "Audio weight (0-1)",
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
      enum: [...sunoModelEnum],
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
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    style: { type: "string", description: "Music style/genre" },
    negativeTags: { type: "string", description: "Styles to avoid" },
    title: { type: "string", description: "Song title" },
    personaId: {
      type: "string",
      description: "Persona ID (custom mode only)",
    },
    ...sunoMixFields,
  },
};

export const sunoExtendSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/extend",
  contentType: "application/json",
  fields: {
    audioId: {
      type: "string",
      required: true,
      description: "UUID of audio to extend",
    },
    defaultParamFlag: {
      type: "boolean",
      required: true,
      description: "true=use custom params, false=use original",
    },
    model: {
      type: "string",
      required: true,
      enum: [...sunoModelEnum],
      description: "Suno model version",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    continueAt: {
      type: "number",
      description: "Continue at position in seconds",
    },
    prompt: { type: "string", description: "Text prompt or lyrics" },
    style: { type: "string", description: "Music style/genre" },
    title: { type: "string", description: "Song title" },
    negativeTags: { type: "string", description: "Styles to avoid" },
    personaId: { type: "string", description: "Persona ID" },
    ...sunoMixFields,
  },
};

export const sunoUploadCoverSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/upload-cover",
  contentType: "application/json",
  fields: {
    uploadUrl: {
      type: "string",
      required: true,
      description: "Audio file URL (max 8 min)",
    },
    prompt: {
      type: "string",
      required: true,
      description: "Text prompt or lyrics",
    },
    customMode: {
      type: "boolean",
      required: true,
      description: "Enable custom mode",
    },
    instrumental: {
      type: "boolean",
      required: true,
      description: "Generate instrumental (no vocals)",
    },
    model: {
      type: "string",
      required: true,
      enum: [...sunoModelEnum],
      description: "Suno model version",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    style: { type: "string", description: "Music style/genre" },
    title: { type: "string", description: "Song title" },
    negativeTags: { type: "string", description: "Styles to avoid" },
    personaId: {
      type: "string",
      description: "Persona ID (custom mode only)",
    },
    ...sunoMixFields,
  },
};

export const sunoUploadExtendSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/upload-extend",
  contentType: "application/json",
  fields: {
    uploadUrl: {
      type: "string",
      required: true,
      description: "Audio file URL (max 8 min)",
    },
    defaultParamFlag: {
      type: "boolean",
      required: true,
      description: "true=use custom params, false=use original",
    },
    instrumental: {
      type: "boolean",
      required: true,
      description: "Generate instrumental (no vocals)",
    },
    continueAt: {
      type: "number",
      required: true,
      description: "Continue at position in seconds",
    },
    model: {
      type: "string",
      required: true,
      enum: [...sunoModelEnum],
      description: "Suno model version",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    prompt: { type: "string", description: "Text prompt or lyrics" },
    style: { type: "string", description: "Music style/genre" },
    title: { type: "string", description: "Song title" },
    negativeTags: { type: "string", description: "Styles to avoid" },
    personaId: { type: "string", description: "Persona ID" },
    ...sunoMixFields,
  },
};

export const sunoAddInstrumentalSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/add-instrumental",
  contentType: "application/json",
  fields: {
    uploadUrl: {
      type: "string",
      required: true,
      description: "Source audio URL",
    },
    title: { type: "string", required: true, description: "Song title" },
    tags: {
      type: "string",
      required: true,
      description: "Music styles to include",
    },
    negativeTags: {
      type: "string",
      required: true,
      description: "Styles to exclude",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    model: {
      type: "string",
      enum: ["V4_5PLUS", "V5", "V5_5"],
      description: "Suno model version (default V4_5PLUS)",
    },
    ...sunoMixFields,
  },
};

export const sunoAddVocalsSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/add-vocals",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Lyric content/style guidance",
    },
    title: { type: "string", required: true, description: "Song title" },
    negativeTags: {
      type: "string",
      required: true,
      description: "Styles to exclude",
    },
    style: {
      type: "string",
      required: true,
      description: "Music genre",
    },
    uploadUrl: {
      type: "string",
      required: true,
      description: "Source audio URL",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    model: {
      type: "string",
      enum: ["V4_5PLUS", "V5", "V5_5"],
      description: "Suno model version (default V4_5PLUS)",
    },
    ...sunoMixFields,
  },
};

export const sunoReplaceSectionSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/replace-section",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Parent task ID",
    },
    audioId: {
      type: "string",
      required: true,
      description: "Audio UUID",
    },
    prompt: {
      type: "string",
      required: true,
      description: "Replacement segment description",
    },
    tags: {
      type: "string",
      required: true,
      description: "Music style tags",
    },
    title: { type: "string", required: true, description: "Song title" },
    infillStartS: {
      type: "number",
      required: true,
      description: "Start time in seconds",
    },
    infillEndS: {
      type: "number",
      required: true,
      description: "End time in seconds",
    },
    negativeTags: { type: "string", description: "Styles to avoid" },
    fullLyrics: {
      type: "string",
      description: "Complete lyrics with modified section",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const sunoTimestampedLyricsSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/get-timestamped-lyrics",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID",
    },
    audioId: {
      type: "string",
      required: true,
      description: "Audio UUID",
    },
  },
};

export const sunoGeneratePersonaSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/generate-persona",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Original music task ID",
    },
    audioId: {
      type: "string",
      required: true,
      description: "Audio track UUID",
    },
    name: {
      type: "string",
      required: true,
      description: "Persona name",
    },
    description: {
      type: "string",
      required: true,
      description: "Detailed persona description",
    },
    vocalStart: {
      type: "number",
      description: "Vocal sample start (seconds, default 0)",
    },
    vocalEnd: {
      type: "number",
      description: "Vocal sample end (10-30s from vocalStart)",
    },
    style: {
      type: "string",
      description: "Supplemental style tag",
    },
  },
};

export const sunoMashupSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/mashup",
  contentType: "application/json",
  fields: {
    uploadUrlList: {
      type: "array",
      required: true,
      description: "Exactly 2 audio URLs to mashup",
      items: { type: "string" },
    },
    customMode: {
      type: "boolean",
      required: true,
      description: "Enable custom mode",
    },
    model: {
      type: "string",
      required: true,
      enum: [...sunoModelEnum],
      description: "Suno model version",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
    instrumental: {
      type: "boolean",
      description: "Generate instrumental (no vocals)",
    },
    prompt: { type: "string", description: "Text prompt or lyrics" },
    style: { type: "string", description: "Music style/genre" },
    title: { type: "string", description: "Song title" },
    ...sunoMixFields,
  },
};

export const sunoSoundsSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/generate/sounds",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Sound description (max 500 chars)",
    },
    model: {
      type: "string",
      enum: ["V5", "V5_5"],
      description: "Suno model version",
    },
    soundLoop: {
      type: "boolean",
      description: "Loop the sound (default false)",
    },
    soundTempo: {
      type: "number",
      description: "Tempo in BPM (1-300)",
    },
    soundKey: {
      type: "string",
      enum: [
        "Cm",
        "C#m",
        "Dm",
        "D#m",
        "Em",
        "Fm",
        "F#m",
        "Gm",
        "G#m",
        "Am",
        "A#m",
        "Bm",
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
        "Any",
      ],
      description: "Musical key",
    },
    grabLyrics: {
      type: "boolean",
      description: "Grab lyrics (default false)",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const sunoCoverGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/suno/cover/generate",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Original music task ID",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const sunoLyricsSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/lyrics",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Lyrics prompt (max 200 chars)",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
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

export const claudeMessagesSchema: PayloadSchema = {
  method: "POST",
  path: "/claude/v1/messages",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name",
      enum: ["claude-sonnet-4-6", "claude-haiku-4-5"],
    },
    messages: {
      type: "array",
      required: true,
      description: "Conversation messages in chronological order",
      items: {
        type: "object",
        properties: {
          role: {
            type: "string",
            required: true,
            enum: ["user", "assistant"],
          },
          content: { type: "string", required: true },
        },
      },
    },
    tools: {
      type: "array",
      description: "Optional callable tools with input_schema",
      items: {
        type: "object",
        properties: {
          name: { type: "string", required: true },
          description: { type: "string", required: true },
          input_schema: { type: "object", required: true },
        },
      },
    },
    thinkingFlag: {
      type: "boolean",
      description: "Project-specific thinking flag",
    },
    stream: {
      type: "boolean",
      description: "If true, response is returned as SSE stream",
    },
  },
};

// claudeHaiku uses the same schema as claude (same endpoint shape, different base URL)
export const claudeHaikuMessagesSchema: PayloadSchema = claudeMessagesSchema;

export const vocalRemovalGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/vocal-removal/generate",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID from a completed music generation task",
    },
    audioId: {
      type: "string",
      required: true,
      description: "Audio track ID to process",
    },
    type: {
      type: "string",
      required: true,
      enum: ["separate_vocal", "split_stem"],
      description:
        "Separation type: separate_vocal (2 stems) or split_stem (12 stems)",
    },
    callBackUrl: {
      type: "string",
      required: true,
      description: "Webhook URL for results",
    },
  },
};

export const midiGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/midi/generate",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID from a completed vocal separation task",
    },
    callBackUrl: {
      type: "string",
      required: true,
      description: "Webhook URL for results",
    },
    audioId: {
      type: "string",
      description: "Specific separated track to convert",
    },
  },
};

export const wavGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/wav/generate",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID from a completed music generation task",
    },
    audioId: {
      type: "string",
      required: true,
      description: "Audio track ID to convert",
    },
    callBackUrl: {
      type: "string",
      required: true,
      description: "Webhook URL for results",
    },
  },
};

export const codexResponsesSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/responses",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Codex model name",
      enum: [
        "gpt-5-codex",
        "gpt-5.1-codex",
        "gpt-5.2-codex",
        "gpt-5.3-codex",
        "gpt-5.4-codex",
      ],
    },
    input: {
      type: "string",
      required: true,
      description: "Plain text or array of input messages",
    },
    stream: { type: "boolean", description: "Enable SSE streaming" },
    reasoning: {
      type: "object",
      description: "Reasoning configuration",
      properties: {
        effort: {
          type: "string",
          required: true,
          enum: ["minimal", "low", "medium", "high", "xhigh"],
        },
      },
    },
    tools: {
      type: "array",
      description: "Web search or function tools",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            required: true,
            enum: ["web_search", "function"],
          },
        },
      },
    },
    tool_choice: { type: "string", description: "Tool selection mode" },
  },
};

export const geminiChatCompletionsSchema: PayloadSchema = {
  method: "POST",
  path: "/<model>/v1/chat/completions",
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
            enum: ["user", "assistant", "system", "developer", "tool"],
          },
          content: { type: "string", required: true },
        },
      },
    },
    stream: { type: "boolean", description: "Enable streaming" },
    tools: {
      type: "array",
      description: "Function calling tools",
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
    include_thoughts: {
      type: "boolean",
      description: "Include reasoning thoughts",
    },
    reasoning_effort: {
      type: "string",
      enum: ["low", "high"],
      description: "Reasoning effort level",
    },
    response_format: {
      type: "object",
      description: "Structured output format",
      properties: {
        type: { type: "string", required: true, enum: ["json_schema"] },
        json_schema: { type: "object", required: true },
      },
    },
  },
};

export const styleGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/style/generate",
  contentType: "application/json",
  fields: {
    content: {
      type: "string",
      required: true,
      description: "Style description to enhance",
    },
  },
};

export const mp4GenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/mp4/generate",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID from music generation",
    },
    audioId: {
      type: "string",
      required: true,
      description: "Audio track ID from music generation",
    },
    callBackUrl: {
      type: "string",
      required: true,
      description: "Webhook URL for completion notification",
    },
    author: {
      type: "string",
      description: "Artist name (max 50 chars)",
    },
    domainName: {
      type: "string",
      description: "Brand watermark (max 50 chars)",
    },
  },
};

export const gpt4oImageGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/gpt4o-image/generate",
  contentType: "application/json",
  fields: {
    prompt: { type: "string", description: "Text description for generation" },
    filesUrl: {
      type: "array",
      description: "Input image URLs (max 5)",
      items: { type: "string" },
    },
    size: {
      type: "string",
      required: true,
      enum: ["1:1", "3:2", "2:3"],
      description: "Output aspect ratio",
    },
    maskUrl: {
      type: "string",
      description: "Mask image URL (white=preserve, black=modify)",
    },
    nVariants: {
      type: "number",
      enum: [1, 2, 4],
      description: "Number of output variants",
    },
    isEnhance: {
      type: "boolean",
      description: "Enable prompt enhancement",
    },
    enableFallback: {
      type: "boolean",
      description: "Auto-fallback to backup model",
    },
    fallbackModel: {
      type: "string",
      enum: ["GPT_IMAGE_1", "FLUX_MAX"],
      description: "Backup model when primary unavailable",
    },
    uploadCn: {
      type: "boolean",
      description: "Upload to China servers",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const gpt4oImageDownloadUrlSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/gpt4o-image/download-url",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID",
    },
    url: {
      type: "string",
      required: true,
      description: "CDN URL to convert to a temporary download link",
    },
  },
};
export const fluxKontextGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/flux/kontext/generate",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Text describing desired image or edits (English only)",
    },
    inputImage: {
      type: "string",
      description: "URL of image to edit",
    },
    model: {
      type: "string",
      enum: ["flux-kontext-pro", "flux-kontext-max"],
      description: "Model version (default flux-kontext-pro)",
    },
    aspectRatio: {
      type: "string",
      enum: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
      description: "Output aspect ratio (default 16:9)",
    },
    outputFormat: {
      type: "string",
      enum: ["jpeg", "png"],
      description: "Image format (default jpeg)",
    },
    promptUpsampling: {
      type: "boolean",
      description: "Enable prompt upsampling",
    },
    safetyTolerance: {
      type: "number",
      description: "Moderation level (0-6 generation, 0-2 editing)",
    },
    watermark: { type: "string", description: "Watermark text" },
    enableTranslation: {
      type: "boolean",
      description: "Auto-translate non-English prompts (default true)",
    },
    uploadCn: {
      type: "boolean",
      description: "Upload to China servers",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const runwayGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/runway/generate",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Video generation prompt (max 1800 chars)",
    },
    imageUrl: {
      type: "string",
      description: "Reference image URL for animation",
    },
    duration: {
      type: "number",
      required: true,
      enum: [5, 10],
      description: "Video length in seconds",
    },
    quality: {
      type: "string",
      required: true,
      enum: ["720p", "1080p"],
      description: "Output resolution (10s videos cannot use 1080p)",
    },
    aspectRatio: {
      type: "string",
      enum: ["16:9", "4:3", "1:1", "3:4", "9:16"],
      description:
        "Output aspect ratio (required for text-only, not needed with imageUrl)",
    },
    waterMark: { type: "string", description: "Watermark text" },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const runwayExtendSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/runway/extend",
  contentType: "application/json",
  fields: {
    taskId: {
      type: "string",
      required: true,
      description: "Task ID of original video to extend",
    },
    prompt: {
      type: "string",
      required: true,
      description: "Continuation prompt",
    },
    quality: {
      type: "string",
      required: true,
      enum: ["720p", "1080p"],
      description: "Output resolution",
    },
    waterMark: { type: "string", description: "Watermark text" },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const alephGenerateSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/aleph/generate",
  contentType: "application/json",
  fields: {
    prompt: {
      type: "string",
      required: true,
      description: "Text guiding the video transformation",
    },
    videoUrl: {
      type: "string",
      required: true,
      description: "Reference video URL (max 5 seconds processed)",
    },
    referenceImage: {
      type: "string",
      description: "Reference image influencing output style",
    },
    aspectRatio: {
      type: "string",
      enum: ["16:9", "9:16", "4:3", "3:4", "1:1", "21:9"],
      description: "Output aspect ratio",
    },
    seed: { type: "number", description: "Random seed for reproducibility" },
    waterMark: { type: "string", description: "Watermark text" },
    uploadCn: {
      type: "boolean",
      description: "Upload to China servers",
    },
    callBackUrl: { type: "string", description: "Webhook callback URL" },
  },
};

export const modelInputSchemas: Record<KieMediaModel, ModelInputSchema> = {
  "kling-3.0/video": {
    type: "video",
    fields: {
      prompt: { type: "string", description: "Video generation prompt" },
      image_urls: {
        type: "array",
        description: "Reference image URLs",
        items: { type: "string" },
      },
      sound: {
        type: "boolean",
        description: "Include sound (default false, true when multi_shots)",
      },
      duration: {
        type: "string",
        required: true,
        enum: [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        description: "Duration in seconds",
      },
      aspect_ratio: {
        type: "string",
        enum: ["16:9", "9:16", "1:1"],
        description: "Output aspect ratio",
      },
      mode: {
        type: "string",
        required: true,
        enum: ["std", "pro"],
        description: "Quality mode",
      },
      multi_shots: {
        type: "boolean",
        required: true,
        description: "Enable multi-shot mode",
      },
      multi_prompt: {
        type: "array",
        description: "Per-shot prompts",
        items: {
          type: "object",
          properties: {
            prompt: { type: "string", required: true },
            duration: { type: "number", required: true },
          },
        },
      },
      kling_elements: {
        type: "array",
        description: "Kling elements for generation",
        items: {
          type: "object",
          properties: {
            name: { type: "string", required: true },
            description: { type: "string", required: true },
            element_input_urls: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  },

  "kling-3.0/motion-control": {
    type: "video",
    fields: {
      prompt: { type: "string", description: "Motion control prompt" },
      input_urls: {
        type: "array",
        required: true,
        description: "Input image URLs",
        items: { type: "string" },
      },
      video_urls: {
        type: "array",
        required: true,
        description: "Input video URLs",
        items: { type: "string" },
      },
      mode: {
        type: "string",
        required: true,
        enum: ["720p", "1080p"],
        description: "Output resolution (default 720p)",
      },
      character_orientation: {
        type: "string",
        required: true,
        enum: ["video", "image"],
        description: "Character orientation source (default video)",
      },
    },
  },

  "grok-imagine/text-to-image": {
    type: "image",
    fields: {
      prompt: {
        type: "string",
        required: true,
        description: "Image generation prompt",
      },
      aspect_ratio: {
        type: "string",
        enum: ["2:3", "3:2", "1:1", "16:9", "9:16"],
        description: "Output aspect ratio",
      },
    },
  },

  "grok-imagine/image-to-image": {
    type: "image",
    fields: {
      prompt: { type: "string", description: "Modification prompt" },
      image_urls: {
        type: "array",
        required: true,
        description: "Input image URLs (max 5)",
        items: { type: "string" },
      },
    },
  },

  "grok-imagine/text-to-video": {
    type: "video",
    fields: {
      prompt: {
        type: "string",
        required: true,
        description: "Video generation prompt",
      },
      aspect_ratio: {
        type: "string",
        enum: ["2:3", "3:2", "1:1", "16:9", "9:16"],
        description: "Output aspect ratio (default 2:3)",
      },
      mode: {
        type: "string",
        enum: ["fun", "normal", "spicy"],
        description: "Generation mode (default normal)",
      },
      duration: {
        type: "string",
        enum: ["6", "10"],
        description: "Duration in seconds (default 6)",
      },
      resolution: {
        type: "string",
        enum: ["480p", "720p"],
        description: "Output resolution (default 480p)",
      },
    },
  },

  "grok-imagine/image-to-video": {
    type: "video",
    fields: {
      prompt: { type: "string", description: "Video generation prompt" },
      image_urls: {
        type: "array",
        description: "Reference image URLs (max 7)",
        items: { type: "string" },
      },
      task_id: { type: "string", description: "Reference task ID" },
      index: { type: "number", description: "Frame index (0-5)" },
      mode: {
        type: "string",
        enum: ["fun", "normal", "spicy"],
        description: "Generation mode (default normal)",
      },
      duration: {
        type: "string",
        enum: ["6", "10"],
        description: "Duration in seconds (default 6)",
      },
      resolution: {
        type: "string",
        enum: ["480p", "720p"],
        description: "Output resolution (default 480p)",
      },
      aspect_ratio: {
        type: "string",
        enum: ["2:3", "3:2", "1:1", "16:9", "9:16"],
        description: "Output aspect ratio (default 16:9)",
      },
    },
  },

  "grok-imagine/extend": {
    type: "video",
    fields: {
      task_id: {
        type: "string",
        required: true,
        description: "Video task ID to extend",
      },
      prompt: {
        type: "string",
        required: true,
        description: "Extension prompt",
      },
      extend_at: {
        type: "number",
        description: "Starting position for extension",
      },
      extend_times: {
        type: "string",
        required: true,
        enum: ["6", "10"],
        description: "Extension duration in seconds",
      },
    },
  },

  "grok-imagine/upscale": {
    type: "video",
    fields: {
      task_id: {
        type: "string",
        required: true,
        description: "Video task ID to upscale",
      },
    },
  },

  "nano-banana-pro": {
    type: "image",
    fields: {
      prompt: {
        type: "string",
        required: true,
        description: "Image generation prompt",
      },
      image_input: {
        type: "array",
        description: "Reference images",
        items: { type: "string" },
      },
      aspect_ratio: {
        type: "string",
        enum: [
          "1:1",
          "2:3",
          "3:2",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "9:16",
          "16:9",
          "21:9",
          "auto",
        ],
        description: "Output aspect ratio",
      },
      resolution: {
        type: "string",
        enum: ["1K", "2K", "4K"],
        description: "Output resolution",
      },
      output_format: {
        type: "string",
        enum: ["png", "jpg"],
        description: "Image format",
      },
    },
  },

  "bytedance/seedance-1.5-pro": {
    type: "video",
    fields: {
      prompt: {
        type: "string",
        required: true,
        description: "Video generation prompt (3-2500 chars)",
      },
      input_urls: {
        type: "array",
        description: "Reference image URLs (max 2)",
        items: { type: "string" },
      },
      aspect_ratio: {
        type: "string",
        required: true,
        enum: ["1:1", "21:9", "4:3", "3:4", "16:9", "9:16"],
        description: "Output aspect ratio (default 1:1)",
      },
      resolution: {
        type: "string",
        enum: ["480p", "720p", "1080p"],
        description: "Output resolution (default 720p)",
      },
      duration: {
        type: "number",
        enum: [4, 8, 12],
        description: "Duration in seconds (default 8)",
      },
      fixed_lens: {
        type: "boolean",
        description: "Lock camera movement",
      },
      generate_audio: {
        type: "boolean",
        description: "Generate accompanying audio",
      },
      nsfw_checker: {
        type: "boolean",
        description: "Content safety filter",
      },
    },
  },

  "nano-banana-2": {
    type: "image",
    fields: {
      prompt: {
        type: "string",
        required: true,
        description: "Image generation prompt",
      },
      image_input: {
        type: "array",
        description: "Reference images",
        items: { type: "string" },
      },
      aspect_ratio: {
        type: "string",
        enum: [
          "1:1",
          "2:3",
          "3:2",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "9:16",
          "16:9",
          "21:9",
          "1:4",
          "1:8",
          "4:1",
          "8:1",
          "auto",
        ],
        description: "Output aspect ratio",
      },
      resolution: {
        type: "string",
        enum: ["1K", "2K", "4K"],
        description: "Output resolution",
      },
      output_format: {
        type: "string",
        enum: ["png", "jpg"],
        description: "Image format",
      },
    },
  },

  "gpt-image/1.5-image-to-image": {
    type: "image",
    fields: {
      input_urls: {
        type: "array",
        required: true,
        description: "Input image URLs",
        items: { type: "string" },
      },
      prompt: {
        type: "string",
        required: true,
        description: "Modification prompt",
      },
      aspect_ratio: {
        type: "string",
        enum: ["1:1", "2:3", "3:2"],
        description: "Output aspect ratio",
      },
      quality: {
        type: "string",
        enum: ["medium", "high"],
        description: "Output quality",
      },
    },
  },

  "seedream/5-lite-image-to-image": {
    type: "image",
    fields: {
      image_urls: {
        type: "array",
        required: true,
        description: "Input image URLs (max 14)",
        items: { type: "string" },
      },
      prompt: {
        type: "string",
        required: true,
        description: "Modification prompt (3-3000 chars)",
      },
      aspect_ratio: {
        type: "string",
        enum: ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9"],
        description: "Output aspect ratio (default 1:1)",
      },
      quality: {
        type: "string",
        enum: ["basic", "high"],
        description: "Output quality (basic=2K, high=4K, default basic)",
      },
      nsfw_checker: {
        type: "boolean",
        description: "Content safety filter",
      },
    },
  },

  "elevenlabs/text-to-dialogue-v3": {
    type: "audio",
    fields: {
      dialogue: {
        type: "array",
        required: true,
        description: "Dialogue lines",
        items: {
          type: "object",
          properties: {
            text: { type: "string", required: true },
            voice: {
              type: "string",
              required: true,
              enum: [
                "Adam",
                "Alice",
                "Bill",
                "Brian",
                "Callum",
                "Charlie",
                "Chris",
                "Daniel",
                "Eric",
                "George",
                "Harry",
                "Jessica",
                "Laura",
                "Liam",
                "Lily",
                "Matilda",
                "River",
                "Roger",
                "Sarah",
                "Will",
              ],
            },
          },
        },
      },
      stability: {
        type: "number",
        enum: [0, 0.5, 1.0],
        description: "Voice stability",
      },
      language_code: {
        type: "string",
        description: "Language/locale code",
      },
    },
  },

  "elevenlabs/sound-effect-v2": {
    type: "audio",
    fields: {
      text: {
        type: "string",
        required: true,
        description: "Sound effect description",
      },
      output_format: {
        type: "string",
        enum: [
          "mp3_22050_32",
          "mp3_44100_32",
          "mp3_44100_64",
          "mp3_44100_96",
          "mp3_44100_128",
          "mp3_44100_192",
          "pcm_8000",
          "pcm_16000",
          "pcm_22050",
          "pcm_24000",
          "pcm_44100",
          "pcm_48000",
          "ulaw_8000",
          "alaw_8000",
          "opus_48000_32",
          "opus_48000_64",
          "opus_48000_96",
          "opus_48000_128",
          "opus_48000_192",
        ],
        description: "Audio format (default mp3_44100_128)",
      },
      prompt_influence: {
        type: "number",
        description: "Prompt influence weight (0-1, default 0.3)",
      },
      loop: { type: "boolean", description: "Loop the audio" },
      duration_seconds: {
        type: "number",
        description: "Target duration in seconds",
      },
    },
  },

  "elevenlabs/audio-isolation": {
    type: "audio",
    fields: {
      audio_url: {
        type: "string",
        required: true,
        description: "URL to audio file for vocal isolation",
      },
    },
  },

  "elevenlabs/speech-to-text": {
    type: "transcription",
    fields: {
      audio_url: {
        type: "string",
        required: true,
        description: "URL to audio file",
      },
      tag_audio_events: {
        type: "boolean",
        description: "Tag audio events in transcript",
      },
      diarize: {
        type: "boolean",
        description: "Identify speaker changes",
      },
      language_code: {
        type: "string",
        description: "Language/locale code",
      },
    },
  },

  "qwen2/text-to-image": {
    type: "image",
    fields: {
      prompt: {
        type: "string",
        required: true,
        description: "Image generation prompt",
      },
      image_size: {
        type: "string",
        enum: [
          "square",
          "square_hd",
          "portrait_4_3",
          "portrait_16_9",
          "landscape_4_3",
          "landscape_16_9",
        ],
        description: "Output image size (default square_hd)",
      },
      num_inference_steps: {
        type: "number",
        description: "Inference steps (2-250, default 30)",
      },
      seed: { type: "number", description: "Random seed" },
      guidance_scale: {
        type: "number",
        description: "Guidance scale (0-20, default 2.5)",
      },
      enable_safety_checker: {
        type: "boolean",
        description: "Content safety filter",
      },
      output_format: {
        type: "string",
        enum: ["png", "jpeg"],
        description: "Image format (default png)",
      },
      negative_prompt: {
        type: "string",
        description: "Negative prompt (max 500 chars)",
      },
      acceleration: {
        type: "string",
        enum: ["none", "regular", "high"],
        description: "Speed vs quality tradeoff (default none)",
      },
    },
  },

  "sora-watermark-remover": {
    type: "video",
    fields: {
      video_url: {
        type: "string",
        required: true,
        description: "URL to video for watermark removal",
      },
      upload_method: {
        type: "string",
        enum: ["s3", "oss"],
        description: "Storage destination (default s3, oss for China)",
      },
    },
  },
};
