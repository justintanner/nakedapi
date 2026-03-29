import { KieError } from "./types";
import type { PayloadSchema, ValidationResult } from "./types";
import { codexResponsesSchema } from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export type KieCodexModel = "gpt-5-4" | "gpt-5-codex" | "gpt-5.1-codex";

export interface KieCodexTool {
  type: string;
  name?: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface KieCodexRequest {
  model: KieCodexModel;
  input: string | { role: string; content: string }[];
  stream?: boolean;
  reasoning?: { effort?: "low" | "medium" | "high" };
  tools?: KieCodexTool[];
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface KieCodexOutputItem {
  type?: string;
  id?: string;
  content?: string | { type: string; text?: string }[];
  role?: string;
  status?: string;
}

export interface KieCodexResponse {
  id?: string;
  object?: string;
  model?: string;
  output?: KieCodexOutputItem[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  error?: string;
}

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface KieCodexResponsesMethod {
  (req: KieCodexRequest, signal?: AbortSignal): Promise<KieCodexResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KieCodexV1Namespace {
  responses: KieCodexResponsesMethod;
}

export interface KieCodexProvider {
  codex: {
    v1: KieCodexV1Namespace;
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createCodexProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): KieCodexProvider {
  return {
    codex: {
      v1: {
        responses: Object.assign(
          async function responses(
            req: KieCodexRequest,
            signal?: AbortSignal
          ): Promise<KieCodexResponse> {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            if (signal) {
              signal.addEventListener("abort", () => controller.abort());
            }

            try {
              const res = await doFetch(`${baseURL}/codex/v1/responses`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(req),
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              if (!res.ok) {
                let message = `Kie Codex API error: ${res.status}`;
                let body: unknown = null;
                try {
                  body = await res.json();
                  if (
                    typeof body === "object" &&
                    body !== null &&
                    "msg" in body &&
                    typeof (body as { msg?: string }).msg === "string"
                  ) {
                    message = `Kie Codex API error ${res.status}: ${(body as { msg: string }).msg}`;
                  }
                } catch {
                  // ignore parse errors
                }
                throw new KieError(message, res.status, body);
              }

              return (await res.json()) as KieCodexResponse;
            } catch (error) {
              clearTimeout(timeoutId);
              if (error instanceof KieError) throw error;
              if (error instanceof SyntaxError) {
                throw new KieError("Failed to parse Codex response", 500);
              }
              throw new KieError(`Codex request failed: ${error}`, 500);
            }
          },
          {
            payloadSchema: codexResponsesSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, codexResponsesSchema);
            },
          }
        ),
      },
    },
  };
}
