import {
  FireworksOptions,
  FireworksChatRequest,
  FireworksChatResponse,
  FireworksCompletionRequest,
  FireworksCompletionResponse,
  FireworksEmbeddingRequest,
  FireworksEmbeddingResponse,
  FireworksRerankRequest,
  FireworksRerankResponse,
  AnthropicMessagesRequest,
  AnthropicMessagesResponse,
  AnthropicStreamEvent,
  FireworksTextToImageRequest,
  FireworksTextToImageResponse,
  FireworksKontextRequest,
  FireworksKontextResponse,
  FireworksGetResultRequest,
  FireworksGetResultResponse,
  FireworksProvider,
  FireworksError,
} from "./types";
import type { ValidationResult } from "./types";
import {
  chatCompletionsSchema,
  completionsSchema,
  embeddingsSchema,
  rerankSchema,
  messagesSchema,
  textToImageSchema,
  kontextSchema,
  getResultSchema,
} from "./schemas";
import { validatePayload } from "./validate";
import { sseToIterable } from "./sse";

export function fireworks(opts: FireworksOptions): FireworksProvider {
  const baseURL = opts.baseURL ?? "https://api.fireworks.ai/inference/v1";
  const doFetch = opts.fetch ?? fetch;
  const timeout = opts.timeout ?? 30000;

  async function makeRequest<T>(
    path: string,
    body: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Fireworks API error: ${res.status}`;
        let resBody: unknown = null;
        try {
          resBody = await res.json();
          if (
            typeof resBody === "object" &&
            resBody !== null &&
            "error" in resBody
          ) {
            const err = (resBody as { error: { message?: string } }).error;
            if (err?.message) {
              message = `Fireworks API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new FireworksError(message, res.status, resBody);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof FireworksError) throw error;
      throw new FireworksError(`Fireworks request failed: ${error}`, 500);
    }
  }

  async function* messagesStreamImpl(
    req: AnthropicMessagesRequest,
    signal?: AbortSignal
  ): AsyncIterable<AnthropicStreamEvent> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await doFetch(`${baseURL}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Fireworks API error: ${res.status}`;
        let resBody: unknown = null;
        try {
          resBody = await res.json();
          if (
            typeof resBody === "object" &&
            resBody !== null &&
            "error" in resBody
          ) {
            const err = (resBody as { error: { message?: string } }).error;
            if (err?.message) {
              message = `Fireworks API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new FireworksError(message, res.status, resBody);
      }

      for await (const { event, data } of sseToIterable(res)) {
        if (event === "message_stop") {
          break;
        }

        try {
          const parsed: AnthropicStreamEvent = JSON.parse(data);
          yield parsed;
        } catch {
          // ignore non-JSON lines
        }
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function messagesImpl(
    req: AnthropicMessagesRequest,
    signal?: AbortSignal
  ): Promise<AnthropicMessagesResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await doFetch(`${baseURL}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Fireworks API error: ${res.status}`;
        let resBody: unknown = null;
        try {
          resBody = await res.json();
          if (
            typeof resBody === "object" &&
            resBody !== null &&
            "error" in resBody
          ) {
            const err = (resBody as { error: { message?: string } }).error;
            if (err?.message) {
              message = `Fireworks API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new FireworksError(message, res.status, resBody);
      }

      return (await res.json()) as AnthropicMessagesResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function makeWorkflowRequest<T>(
    model: string,
    suffix: string,
    body: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const url = `${baseURL}/workflows/accounts/fireworks/models/${model}${suffix}`;
      const res = await doFetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Fireworks API error: ${res.status}`;
        let resBody: unknown = null;
        try {
          resBody = await res.json();
          if (
            typeof resBody === "object" &&
            resBody !== null &&
            "error" in resBody
          ) {
            const err = (resBody as { error: { message?: string } }).error;
            if (err?.message) {
              message = `Fireworks API error ${res.status}: ${err.message}`;
            }
          }
          if (
            typeof resBody === "object" &&
            resBody !== null &&
            "error_message" in resBody
          ) {
            message = `Fireworks API error ${res.status}: ${(resBody as { error_message: string }).error_message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new FireworksError(message, res.status, resBody);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof FireworksError) throw error;
      throw new FireworksError(`Fireworks request failed: ${error}`, 500);
    }
  }

  return {
    v1: {
      chat: {
        completions: Object.assign(
          async function completions(
            req: FireworksChatRequest,
            signal?: AbortSignal
          ): Promise<FireworksChatResponse> {
            return await makeRequest<FireworksChatResponse>(
              "/chat/completions",
              req,
              signal
            );
          },
          {
            payloadSchema: chatCompletionsSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, chatCompletionsSchema);
            },
          }
        ),
      },
      completions: Object.assign(
        async function completions(
          req: FireworksCompletionRequest,
          signal?: AbortSignal
        ): Promise<FireworksCompletionResponse> {
          return await makeRequest<FireworksCompletionResponse>(
            "/completions",
            req,
            signal
          );
        },
        {
          payloadSchema: completionsSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, completionsSchema);
          },
        }
      ),
      embeddings: Object.assign(
        async function embeddings(
          req: FireworksEmbeddingRequest,
          signal?: AbortSignal
        ): Promise<FireworksEmbeddingResponse> {
          return await makeRequest<FireworksEmbeddingResponse>(
            "/embeddings",
            req,
            signal
          );
        },
        {
          payloadSchema: embeddingsSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, embeddingsSchema);
          },
        }
      ),
      rerank: Object.assign(
        async function rerank(
          req: FireworksRerankRequest,
          signal?: AbortSignal
        ): Promise<FireworksRerankResponse> {
          return await makeRequest<FireworksRerankResponse>(
            "/rerank",
            req,
            signal
          );
        },
        {
          payloadSchema: rerankSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, rerankSchema);
          },
        }
      ),
      messages: Object.assign(messagesImpl, {
        stream: Object.assign(messagesStreamImpl, {
          payloadSchema: messagesSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, messagesSchema);
          },
        }),
        payloadSchema: messagesSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, messagesSchema);
        },
      }),
      workflows: {
        textToImage: Object.assign(
          async function textToImage(
            model: string,
            req: FireworksTextToImageRequest,
            signal?: AbortSignal
          ): Promise<FireworksTextToImageResponse> {
            return await makeWorkflowRequest<FireworksTextToImageResponse>(
              model,
              "/text_to_image",
              req,
              signal
            );
          },
          {
            payloadSchema: textToImageSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, textToImageSchema);
            },
          }
        ),
        kontext: Object.assign(
          async function kontext(
            model: string,
            req: FireworksKontextRequest,
            signal?: AbortSignal
          ): Promise<FireworksKontextResponse> {
            return await makeWorkflowRequest<FireworksKontextResponse>(
              model,
              "",
              req,
              signal
            );
          },
          {
            payloadSchema: kontextSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, kontextSchema);
            },
          }
        ),
        getResult: Object.assign(
          async function getResult(
            model: string,
            req: FireworksGetResultRequest,
            signal?: AbortSignal
          ): Promise<FireworksGetResultResponse> {
            return await makeWorkflowRequest<FireworksGetResultResponse>(
              model,
              "/get_result",
              req,
              signal
            );
          },
          {
            payloadSchema: getResultSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, getResultSchema);
            },
          }
        ),
      },
    },
  };
}
