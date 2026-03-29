import { KieError } from "./types";
import type {
  GeminiModel,
  GeminiChatRequest,
  GeminiChatResponse,
  PayloadSchema,
  ValidationResult,
} from "./types";
import { geminiChatCompletionsSchema } from "./schemas";
import { validatePayload } from "./validate";

interface KieGeminiCompletionsMethod {
  (req: GeminiChatRequest, signal?: AbortSignal): Promise<GeminiChatResponse>;
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
  "gemini-2.5-flash": KieGeminiModelNamespace;
  "gemini-2.5-pro": KieGeminiModelNamespace;
  "gemini-3-pro": KieGeminiModelNamespace;
  "gemini-3.1-pro": KieGeminiModelNamespace;
  "gemini-3-flash": KieGeminiModelNamespace;
}

function createModelEndpoint(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number,
  model: GeminiModel
): KieGeminiModelNamespace {
  return {
    v1: {
      chat: {
        completions: Object.assign(
          async function completions(
            req: GeminiChatRequest,
            signal?: AbortSignal
          ): Promise<GeminiChatResponse> {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            if (signal) {
              signal.addEventListener("abort", () => controller.abort());
            }

            try {
              const res = await doFetch(
                `${baseURL}/${model}/v1/chat/completions`,
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

              return (await res.json()) as GeminiChatResponse;
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
            payloadSchema: geminiChatCompletionsSchema,
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
    "gemini-2.5-flash": createModelEndpoint(
      baseURL,
      apiKey,
      doFetch,
      timeout,
      "gemini-2.5-flash"
    ),
    "gemini-2.5-pro": createModelEndpoint(
      baseURL,
      apiKey,
      doFetch,
      timeout,
      "gemini-2.5-pro"
    ),
    "gemini-3-pro": createModelEndpoint(
      baseURL,
      apiKey,
      doFetch,
      timeout,
      "gemini-3-pro"
    ),
    "gemini-3.1-pro": createModelEndpoint(
      baseURL,
      apiKey,
      doFetch,
      timeout,
      "gemini-3.1-pro"
    ),
    "gemini-3-flash": createModelEndpoint(
      baseURL,
      apiKey,
      doFetch,
      timeout,
      "gemini-3-flash"
    ),
  };
}
