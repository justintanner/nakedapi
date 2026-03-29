import type { PayloadSchema } from "./types";

export const generateContentSchema: PayloadSchema = {
  method: "POST",
  path: "/models/{model}:generateContent",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name (e.g. gemini-2.0-flash)",
    },
    contents: {
      type: "array",
      required: true,
      description: "Conversation contents",
      items: {
        type: "object",
        properties: {
          role: { type: "string", enum: ["user", "model"] },
          parts: {
            type: "array",
            required: true,
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
              },
            },
          },
        },
      },
    },
    generationConfig: {
      type: "object",
      description: "Generation configuration",
      properties: {
        temperature: { type: "number" },
        topP: { type: "number" },
        topK: { type: "number" },
        maxOutputTokens: { type: "number" },
        candidateCount: { type: "number" },
        responseMimeType: { type: "string" },
      },
    },
    safetySettings: {
      type: "array",
      description: "Safety settings",
      items: {
        type: "object",
        properties: {
          category: { type: "string", required: true },
          threshold: { type: "string", required: true },
        },
      },
    },
    cachedContent: {
      type: "string",
      description: "Cached content resource name",
    },
  },
};

export const streamGenerateContentSchema: PayloadSchema = {
  ...generateContentSchema,
  path: "/models/{model}:streamGenerateContent",
};

export const countTokensSchema: PayloadSchema = {
  method: "POST",
  path: "/models/{model}:countTokens",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name",
    },
    contents: {
      type: "array",
      description: "Content to count tokens for",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          parts: { type: "array", required: true },
        },
      },
    },
  },
};

export const embedContentSchema: PayloadSchema = {
  method: "POST",
  path: "/models/{model}:embedContent",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name (e.g. text-embedding-004)",
    },
    content: {
      type: "object",
      required: true,
      description: "Content to embed",
      properties: {
        parts: {
          type: "array",
          required: true,
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
            },
          },
        },
      },
    },
    taskType: {
      type: "string",
      enum: [
        "RETRIEVAL_QUERY",
        "RETRIEVAL_DOCUMENT",
        "SEMANTIC_SIMILARITY",
        "CLASSIFICATION",
        "CLUSTERING",
        "QUESTION_ANSWERING",
        "FACT_VERIFICATION",
        "CODE_RETRIEVAL_QUERY",
      ],
    },
    title: { type: "string" },
    outputDimensionality: { type: "number" },
  },
};

export const batchEmbedContentsSchema: PayloadSchema = {
  method: "POST",
  path: "/models/{model}:batchEmbedContents",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name",
    },
    requests: {
      type: "array",
      required: true,
      description: "Embed requests",
      items: {
        type: "object",
        properties: {
          content: { type: "object", required: true },
          taskType: { type: "string" },
          title: { type: "string" },
          outputDimensionality: { type: "number" },
        },
      },
    },
  },
};

export const predictSchema: PayloadSchema = {
  method: "POST",
  path: "/models/{model}:predict",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name (e.g. imagen-3.0-generate-002)",
    },
    instances: {
      type: "array",
      required: true,
      description: "Prediction instances",
      items: { type: "object" },
    },
    parameters: {
      type: "object",
      description: "Prediction parameters",
    },
  },
};

export const predictLongRunningSchema: PayloadSchema = {
  method: "POST",
  path: "/models/{model}:predictLongRunning",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name (e.g. veo-2.0-generate-001)",
    },
    instances: {
      type: "array",
      required: true,
      description: "Prediction instances",
      items: { type: "object" },
    },
    parameters: {
      type: "object",
      description: "Prediction parameters",
    },
  },
};

export const batchGenerateContentSchema: PayloadSchema = {
  method: "POST",
  path: "/models/{model}:batchGenerateContent",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model name",
    },
    requests: {
      type: "array",
      required: true,
      description: "Generate content requests",
      items: {
        type: "object",
        properties: {
          contents: { type: "array", required: true },
        },
      },
    },
  },
};

export const cachedContentCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/cachedContents",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model to cache for",
    },
    displayName: { type: "string" },
    contents: { type: "array" },
    expireTime: { type: "string" },
    ttl: { type: "string" },
  },
};

export const cachedContentUpdateSchema: PayloadSchema = {
  method: "PATCH",
  path: "/cachedContents/{id}",
  contentType: "application/json",
  fields: {
    expireTime: { type: "string" },
    ttl: { type: "string" },
    displayName: { type: "string" },
  },
};

export const tunedModelCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/tunedModels",
  contentType: "application/json",
  fields: {
    displayName: { type: "string" },
    description: { type: "string" },
    baseModel: {
      type: "string",
      required: true,
      description: "Base model to tune from",
    },
    tuningTask: {
      type: "object",
      required: true,
      description: "Training configuration and data",
      properties: {
        trainingData: { type: "object", required: true },
        hyperparameters: { type: "object" },
      },
    },
    temperature: { type: "number" },
    topP: { type: "number" },
    topK: { type: "number" },
  },
};

export const tunedModelUpdateSchema: PayloadSchema = {
  method: "PATCH",
  path: "/tunedModels/{id}",
  contentType: "application/json",
  fields: {
    displayName: { type: "string" },
    description: { type: "string" },
    temperature: { type: "number" },
    topP: { type: "number" },
    topK: { type: "number" },
  },
};

export const transferOwnershipSchema: PayloadSchema = {
  method: "POST",
  path: "/tunedModels/{id}:transferOwnership",
  contentType: "application/json",
  fields: {
    emailAddress: {
      type: "string",
      required: true,
      description: "Email of the new owner",
    },
  },
};

export const permissionCreateSchema: PayloadSchema = {
  method: "POST",
  path: "/tunedModels/{parent}/permissions",
  contentType: "application/json",
  fields: {
    granteeType: {
      type: "string",
      enum: ["EVERYONE", "USER", "GROUP"],
    },
    emailAddress: { type: "string" },
    role: {
      type: "string",
      enum: ["READER", "WRITER", "OWNER"],
    },
  },
};

export const permissionUpdateSchema: PayloadSchema = {
  method: "PATCH",
  path: "/tunedModels/{parent}/permissions/{id}",
  contentType: "application/json",
  fields: {
    granteeType: {
      type: "string",
      enum: ["EVERYONE", "USER", "GROUP"],
    },
    emailAddress: { type: "string" },
    role: {
      type: "string",
      enum: ["READER", "WRITER", "OWNER"],
    },
  },
};
