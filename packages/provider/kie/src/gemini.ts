import { KieError } from "./types";
import type { PayloadSchema, ValidationResult } from "./types";
import { geminiChatCompletionsSchema } from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KieGeminiModel =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-3-pro"
  | "gemini-3.1-pro"
  | "gemini-3-flash";

export interface KieGeminiChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface KieGeminiChatRequest {
  messages: KieGeminiChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  include_thoughts?: boolean;
  reasoning_effort?: "low" | "medium" | "high";
  response_format?: {
    type: "text" | "json_object" | "json_schema";
    json_schema?: Record<string, unknown>;
  };
}

export interface KieGeminiChatChoice {
  index?: number;
  message?: { role?: string; content?: string };
  finish_reason?: string;
}

export interface KieGeminiChatUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface KieGeminiChatResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: KieGeminiChatChoice[];
  usage?: KieGeminiChatUsage;
  error?: string;
  code?: number;
}

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface KieGeminiCompletionsMethod {
  (
    req: KieGeminiChatRequest,
    signal?: AbortSignal
  ): Promise<KieGeminiChatResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KieGeminiChatNamespace {
  completions: KieGeminiCompletionsMethod;
}

interface KieGeminiV1Namespace {
  chat: KieGeminiChatNamespace;
}

interface KieGeminiModelNamespace {
  v1: KieGeminiV1Namespace;
}

export interface KieGeminiProvider {
  "gemini-2.5-pro": KieGeminiModelNamespace;
  "gemini-2.5-flash": KieGeminiModelNamespace;
  "gemini-3-pro": KieGeminiModelNamespace;
  "gemini-3.1-pro": KieGeminiModelNamespace;
  "gemini-3-flash": KieGeminiModelNamespace;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

function createModelCompletions(
  baseURL: string,
  modelPath: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): KieGeminiModelNamespace {
  return {
    v1: {
      chat: {
        completions: Object.assign(
          async function completions(
            req: KieGeminiChatRequest,
            signal?: AbortSignal
          ): Promise<KieGeminiChatResponse> {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            if (signal) {
              signal.addEventListener("abort", () => controller.abort());
            }

            try {
              const res = await doFetch(
                `${baseURL}/${modelPath}/v1/chat/completions`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(req),
                  signal: controller.signal,
                }
              );

              clearTimeout(timeoutId);

              if (!res.ok) {
                let message = `Kie Gemini API error: ${res.status}`;
                let body: unknown = null;
                try {
                  body = await res.json();
                  if (
                    typeof body === "object" &&
                    body !== null &&
                    "msg" in body &&
                    typeof (body as { msg?: string }).msg === "string"
                  ) {
                    message = `Kie Gemini API error ${res.status}: ${(body as { msg: string }).msg}`;
                  }
                } catch {
                  // ignore parse errors
                }
                throw new KieError(message, res.status, body);
              }

              return (await res.json()) as KieGeminiChatResponse;
            } catch (error) {
              clearTimeout(timeoutId);
              if (error instanceof KieError) throw error;
              if (error instanceof SyntaxError) {
                throw new KieError("Failed to parse Gemini response", 500);
              }
              throw new KieError(`Gemini request failed: ${error}`, 500);
            }
          },
          {
            payloadSchema: {
              ...geminiChatCompletionsSchema,
              path: `/${modelPath}/v1/chat/completions`,
            },
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, geminiChatCompletionsSchema);
            },
          }
        ),
      },
    },
  };
}

export function createGeminiProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): KieGeminiProvider {
  return {
    "gemini-2.5-pro": createModelCompletions(
      baseURL,
      "gemini-2.5-pro",
      apiKey,
      doFetch,
      timeout
    ),
    "gemini-2.5-flash": createModelCompletions(
      baseURL,
      "gemini-2.5-flash",
      apiKey,
      doFetch,
      timeout
    ),
    "gemini-3-pro": createModelCompletions(
      baseURL,
      "gemini-3-pro",
      apiKey,
      doFetch,
      timeout
    ),
    "gemini-3.1-pro": createModelCompletions(
      baseURL,
      "gemini-3.1-pro",
      apiKey,
      doFetch,
      timeout
    ),
    "gemini-3-flash": createModelCompletions(
      baseURL,
      "gemini-3-flash",
      apiKey,
      doFetch,
      timeout
    ),
  };
}
