import {
  ChatRequest,
  TextContentBlock,
  ImageContentBlock,
  KimiCodingOptions,
  KimiCodingError,
  KimiCodingProvider,
  KimiCodingModelListResponse,
  AnthropicMessage,
  AnthropicStreamEvent,
  EmbeddingRequest,
  EmbeddingResponse,
  FileUploadRequest,
  FileObject,
  SearchRequest,
  SearchResponse,
  FetchRequest,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionStreamEvent,
} from "./types";
import type { ValidationResult } from "./types";
import { sseToIterable } from "./sse";
import {
  messagesSchema,
  embeddingsSchema,
  filesUploadSchema,
  searchSchema,
  fetchSchema,
  chatCompletionsSchema,
} from "./schemas";
import { validatePayload } from "./validate";

interface AnthropicErrorBody {
  error?: { message?: string; type?: string };
}

function isAnthropicErrorBody(x: unknown): x is AnthropicErrorBody {
  return (
    typeof x === "object" &&
    x !== null &&
    "error" in x &&
    typeof (x as { error?: unknown }).error === "object"
  );
}

export function textBlock(text: string): TextContentBlock {
  return { type: "text", text };
}

export function imageBase64(
  data: string,
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
): ImageContentBlock {
  return {
    type: "image",
    source: { type: "base64", media_type: mediaType, data },
  };
}

export function imageUrl(url: string): ImageContentBlock {
  return { type: "image", source: { type: "url", url } };
}

export function kimicoding(opts: KimiCodingOptions): KimiCodingProvider {
  const baseURL = opts.baseURL ?? "https://api.kimi.com/coding/";
  const doFetch = opts.fetch ?? fetch;
  const timeout = opts.timeout ?? 30000;

  function buildHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${opts.apiKey}`,
      "x-api-key": opts.apiKey,
      "Content-Type": "application/json",
      "User-Agent": "KimiCLI/1.27.0",
    };
  }

  async function makeGetRequest<T>(
    path: string,
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}${path}`, {
        method: "GET",
        headers: buildAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (
            isAnthropicErrorBody(body) &&
            typeof body.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${body.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, body);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof KimiCodingError) throw error;
      throw new KimiCodingError(`KimiCoding request failed: ${error}`, 500);
    }
  }

  async function* streamImpl(
    req: ChatRequest,
    signal?: AbortSignal
  ): AsyncIterable<AnthropicStreamEvent> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await doFetch(`${baseURL}v1/messages`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(req),
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (
            isAnthropicErrorBody(body) &&
            typeof body.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${body.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, body);
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

  async function chatImpl(
    req: ChatRequest,
    signal?: AbortSignal
  ): Promise<AnthropicMessage> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await doFetch(`${baseURL}v1/messages`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(req),
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (
            isAnthropicErrorBody(body) &&
            typeof body.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${body.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, body);
      }

      return (await res.json()) as AnthropicMessage;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function embeddingsImpl(
    req: EmbeddingRequest,
    signal?: AbortSignal
  ): Promise<EmbeddingResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await doFetch(`${baseURL}v1/embeddings`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(req),
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (
            isAnthropicErrorBody(body) &&
            typeof body.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${body.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, body);
      }

      return (await res.json()) as EmbeddingResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function buildAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${opts.apiKey}`,
      "x-api-key": opts.apiKey,
      "User-Agent": "KimiCLI/1.27.0",
    };
  }

  async function makeTextRequest(
    path: string,
    body: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}${path}`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let errBody: unknown = null;
        try {
          errBody = await res.json();
          if (
            isAnthropicErrorBody(errBody) &&
            typeof errBody.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${errBody.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, errBody);
      }

      return await res.text();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof KimiCodingError) throw error;
      throw new KimiCodingError(`KimiCoding request failed: ${error}`, 500);
    }
  }

  async function filesUploadImpl(
    req: FileUploadRequest,
    signal?: AbortSignal
  ): Promise<FileObject> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const form = new FormData();
      form.append("file", req.file);
      form.append("purpose", req.purpose);

      const res = await doFetch(`${baseURL}v1/files`, {
        method: "POST",
        headers: buildAuthHeaders(),
        body: form,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (
            isAnthropicErrorBody(body) &&
            typeof body.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${body.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, body);
      }

      return (await res.json()) as FileObject;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function searchImpl(
    req: SearchRequest,
    signal?: AbortSignal
  ): Promise<SearchResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}v1/search`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(req),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (
            isAnthropicErrorBody(body) &&
            typeof body.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${body.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, body);
      }

      return (await res.json()) as SearchResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function fetchImpl(
    req: FetchRequest,
    signal?: AbortSignal
  ): Promise<string> {
    return makeTextRequest("v1/fetch", { url: req.url }, signal);
  }

  async function makePostRequest<T>(
    path: string,
    body: Record<string, unknown>,
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
        headers: buildHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let errBody: unknown = null;
        try {
          errBody = await res.json();
          if (
            isAnthropicErrorBody(errBody) &&
            typeof errBody.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${errBody.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, errBody);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof KimiCodingError) throw error;
      throw new KimiCodingError(`KimiCoding request failed: ${error}`, 500);
    }
  }

  // Chat completions (OpenAI-compatible)
  async function chatCompletionsImpl(
    req: ChatCompletionRequest,
    signal?: AbortSignal
  ): Promise<ChatCompletionResponse> {
    return await makePostRequest<ChatCompletionResponse>(
      "v1/chat/completions",
      req as unknown as Record<string, unknown>,
      signal
    );
  }

  async function* chatCompletionsStreamImpl(
    req: ChatCompletionRequest,
    signal?: AbortSignal
  ): AsyncIterable<ChatCompletionStreamEvent> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await doFetch(`${baseURL}v1/chat/completions`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ ...req, stream: true }),
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `KimiCoding error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (
            isAnthropicErrorBody(body) &&
            typeof body.error?.message === "string"
          ) {
            message = `KimiCoding error ${res.status}: ${body.error.message}`;
          }
        } catch {
          // ignore parse errors
        }
        throw new KimiCodingError(message, res.status, body);
      }

      for await (const { data } of sseToIterable(res)) {
        if (data === "[DONE]") {
          break;
        }

        try {
          const parsed: ChatCompletionStreamEvent = JSON.parse(data);
          yield parsed;
        } catch {
          // ignore non-JSON lines
        }
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  const messages = Object.assign(chatImpl, {
    stream: Object.assign(streamImpl, {
      payloadSchema: messagesSchema,
      validatePayload(data: unknown): ValidationResult {
        return validatePayload(data, messagesSchema);
      },
    }),
    payloadSchema: messagesSchema,
    validatePayload(data: unknown): ValidationResult {
      return validatePayload(data, messagesSchema);
    },
  });

  const embeddings = Object.assign(embeddingsImpl, {
    payloadSchema: embeddingsSchema,
    validatePayload(data: unknown): ValidationResult {
      return validatePayload(data, embeddingsSchema);
    },
  });

  const filesUpload = Object.assign(filesUploadImpl, {
    payloadSchema: filesUploadSchema,
    validatePayload(data: unknown): ValidationResult {
      return validatePayload(data, filesUploadSchema);
    },
  });

  const search = Object.assign(searchImpl, {
    payloadSchema: searchSchema,
    validatePayload(data: unknown): ValidationResult {
      return validatePayload(data, searchSchema);
    },
  });

  const fetchEndpoint = Object.assign(fetchImpl, {
    payloadSchema: fetchSchema,
    validatePayload(data: unknown): ValidationResult {
      return validatePayload(data, fetchSchema);
    },
  });

  const chatCompletions = Object.assign(chatCompletionsImpl, {
    stream: Object.assign(chatCompletionsStreamImpl, {
      payloadSchema: chatCompletionsSchema,
      validatePayload(data: unknown): ValidationResult {
        return validatePayload(data, chatCompletionsSchema);
      },
    }),
    payloadSchema: chatCompletionsSchema,
    validatePayload(data: unknown): ValidationResult {
      return validatePayload(data, chatCompletionsSchema);
    },
  });

  return {
    coding: {
      v1: {
        messages,
        models: {
          list: async function list(
            signal?: AbortSignal
          ): Promise<KimiCodingModelListResponse> {
            return await makeGetRequest<KimiCodingModelListResponse>(
              "v1/models",
              signal
            );
          },
        },
        embeddings,
        files: {
          upload: filesUpload,
        },
        search,
        fetch: fetchEndpoint,
        chat: {
          completions: chatCompletions,
        },
      },
    },
  };
}
