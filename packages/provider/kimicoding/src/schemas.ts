import type { PayloadSchema } from "./types";

export const messagesSchema: PayloadSchema = {
  method: "POST",
  path: "/v1/messages",
  contentType: "application/json",
  fields: {
    model: {
      type: "string",
      required: true,
      description: "Model ID (e.g. k2p5)",
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
            enum: ["user", "assistant"],
          },
          content: { type: "string", required: true },
        },
      },
    },
    max_tokens: {
      type: "number",
      required: true,
      description: "Maximum tokens to generate",
    },
    system: { type: "string", description: "System prompt" },
    temperature: { type: "number", description: "Sampling temperature 0-1" },
    top_p: { type: "number", description: "Nucleus sampling threshold" },
    stop_sequences: {
      type: "array",
      description: "Stop sequences",
      items: { type: "string" },
    },
    stream: { type: "boolean", description: "Enable streaming" },
  },
};
