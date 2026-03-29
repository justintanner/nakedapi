import {
  MistralOptions,
  MistralChatRequest,
  MistralChatResponse,
  MistralFimRequest,
  MistralFimResponse,
  MistralEmbeddingRequest,
  MistralEmbeddingResponse,
  MistralOcrRequest,
  MistralOcrResponse,
  MistralModerationRequest,
  MistralModerationResponse,
  MistralChatModerationRequest,
  MistralChatModerationResponse,
  MistralClassificationRequest,
  MistralClassificationResponse,
  MistralChatClassificationRequest,
  MistralChatClassificationResponse,
  MistralModelListResponse,
  MistralModel,
  MistralModelDeleteResponse,
  MistralFile,
  MistralFileListResponse,
  MistralFileDeleteResponse,
  MistralFileUrlResponse,
  MistralFineTuningJobCreateRequest,
  MistralFineTuningJob,
  MistralFineTuningJobListParams,
  MistralFineTuningJobListResponse,
  MistralFineTuningModelUpdateRequest,
  MistralFineTuningModelArchiveResponse,
  MistralBatchJobCreateRequest,
  MistralBatchJob,
  MistralBatchJobListParams,
  MistralBatchJobListResponse,
  MistralSpeechRequest,
  MistralTranscriptionRequest,
  MistralTranscriptionResponse,
  MistralVoice,
  MistralVoiceListResponse,
  MistralVoiceCreateRequest,
  MistralVoiceUpdateRequest,
  MistralAgent,
  MistralAgentListResponse,
  MistralAgentCreateRequest,
  MistralAgentUpdateRequest,
  MistralAgentVersionUpdateRequest,
  MistralAgentVersion,
  MistralAgentVersionListResponse,
  MistralAgentAlias,
  MistralAgentAliasCreateRequest,
  MistralAgentAliasListResponse,
  MistralAgentAliasDeleteRequest,
  MistralAgentCompletionRequest,
  MistralAgentCompletionResponse,
  MistralConversation,
  MistralConversationListParams,
  MistralConversationListResponse,
  MistralConversationCreateRequest,
  MistralConversationAppendRequest,
  MistralConversationHistory,
  MistralConversationMessagesResponse,
  MistralLibrary,
  MistralLibraryCreateRequest,
  MistralLibraryUpdateRequest,
  MistralLibraryListResponse,
  MistralLibraryAccess,
  MistralLibraryAccessListResponse,
  MistralLibraryAccessCreateRequest,
  MistralLibraryAccessDeleteRequest,
  MistralLibraryDocument,
  MistralLibraryDocumentListParams,
  MistralLibraryDocumentListResponse,
  MistralLibraryDocumentUpdateRequest,
  MistralLibraryDocumentTextContent,
  MistralLibraryDocumentStatus,
  MistralLibraryDocumentSignedUrl,
  MistralProvider,
  MistralError,
} from "./types";
import type { ValidationResult } from "./types";
import {
  chatCompletionsSchema,
  fimCompletionsSchema,
  embeddingsSchema,
  ocrSchema,
  moderationsSchema,
  chatModerationsSchema,
  classificationsSchema,
  chatClassificationsSchema,
  fineTuningJobsCreateSchema,
  batchJobsCreateSchema,
  speechSchema,
  transcriptionsSchema,
  voiceCreateSchema,
  voiceUpdateSchema,
  agentCreateSchema,
  agentCompletionsSchema,
  conversationCreateSchema,
  conversationAppendSchema,
  conversationRestartSchema,
  libraryCreateSchema,
} from "./schemas";
import { validatePayload } from "./validate";

export function mistral(opts: MistralOptions): MistralProvider {
  const baseURL = opts.baseURL ?? "https://api.mistral.ai/v1";
  const doFetch = opts.fetch ?? fetch;
  const timeout = opts.timeout ?? 30000;

  async function makeRequest<T>(
    path: string,
    init: { headers: Record<string, string>; body: BodyInit },
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
          ...init.headers,
        },
        body: init.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  function jsonRequest(body: unknown): {
    headers: Record<string, string>;
    body: string;
  } {
    return {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  }

  async function makeBinaryRequest(
    path: string,
    init: { headers: Record<string, string>; body: BodyInit },
    signal?: AbortSignal
  ): Promise<ArrayBuffer> {
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
          ...init.headers,
        },
        body: init.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return await res.arrayBuffer();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makeGetRequest<T>(
    path: string,
    query?: Record<string, string | string[] | boolean | undefined>,
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          for (const v of value) {
            params.append(`${key}[]`, v);
          }
        } else {
          params.append(key, String(value));
        }
      }
    }
    const qs = params.toString();
    const url = `${baseURL}${path}${qs ? `?${qs}` : ""}`;

    try {
      const res = await doFetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makeGetBinaryRequest(
    path: string,
    signal?: AbortSignal
  ): Promise<ArrayBuffer> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}${path}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return await res.arrayBuffer();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makeGetTextRequest(
    path: string,
    signal?: AbortSignal
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    const url = `${baseURL}${path}`;

    try {
      const res = await doFetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return await res.text();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makeEmptyPostRequest<T>(
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
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makeDeleteRequest<T>(
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
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makeDeleteVoidRequest(
    path: string,
    signal?: AbortSignal
  ): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}${path}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makePatchRequest<T>(
    path: string,
    init: { headers: Record<string, string>; body: BodyInit },
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}${path}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          ...init.headers,
        },
        body: init.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  async function makePutRequest<T>(
    path: string,
    init: { headers: Record<string, string>; body: BodyInit },
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await doFetch(`${baseURL}${path}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          ...init.headers,
        },
        body: init.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Mistral API error: ${res.status}`;
        let body: unknown = null;
        try {
          body = await res.json();
          if (typeof body === "object" && body !== null && "message" in body) {
            const msg = (body as { message?: string }).message;
            if (msg) {
              message = `Mistral API error ${res.status}: ${msg}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new MistralError(message, res.status, body);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MistralError) throw error;
      throw new MistralError(`Mistral request failed: ${error}`, 500);
    }
  }

  return {
    v1: {
      chat: {
        completions: Object.assign(
          async function completions(
            req: MistralChatRequest,
            signal?: AbortSignal
          ): Promise<MistralChatResponse> {
            return await makeRequest<MistralChatResponse>(
              "/chat/completions",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: chatCompletionsSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, chatCompletionsSchema);
            },
            moderations: Object.assign(
              async function moderations(
                req: MistralChatModerationRequest,
                signal?: AbortSignal
              ): Promise<MistralChatModerationResponse> {
                return await makeRequest<MistralChatModerationResponse>(
                  "/chat/moderations",
                  jsonRequest(req),
                  signal
                );
              },
              {
                payloadSchema: chatModerationsSchema,
                validatePayload(data: unknown): ValidationResult {
                  return validatePayload(data, chatModerationsSchema);
                },
              }
            ),
            classifications: Object.assign(
              async function classifications(
                req: MistralChatClassificationRequest,
                signal?: AbortSignal
              ): Promise<MistralChatClassificationResponse> {
                return await makeRequest<MistralChatClassificationResponse>(
                  "/chat/classifications",
                  jsonRequest(req),
                  signal
                );
              },
              {
                payloadSchema: chatClassificationsSchema,
                validatePayload(data: unknown): ValidationResult {
                  return validatePayload(data, chatClassificationsSchema);
                },
              }
            ),
          }
        ),
      },
      fim: {
        completions: Object.assign(
          async function completions(
            req: MistralFimRequest,
            signal?: AbortSignal
          ): Promise<MistralFimResponse> {
            return await makeRequest<MistralFimResponse>(
              "/fim/completions",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: fimCompletionsSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, fimCompletionsSchema);
            },
          }
        ),
      },
      embeddings: Object.assign(
        async function embeddings(
          req: MistralEmbeddingRequest,
          signal?: AbortSignal
        ): Promise<MistralEmbeddingResponse> {
          return await makeRequest<MistralEmbeddingResponse>(
            "/embeddings",
            jsonRequest(req),
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
      ocr: Object.assign(
        async function ocr(
          req: MistralOcrRequest,
          signal?: AbortSignal
        ): Promise<MistralOcrResponse> {
          return await makeRequest<MistralOcrResponse>(
            "/ocr",
            jsonRequest(req),
            signal
          );
        },
        {
          payloadSchema: ocrSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, ocrSchema);
          },
        }
      ),
      moderations: Object.assign(
        async function moderations(
          req: MistralModerationRequest,
          signal?: AbortSignal
        ): Promise<MistralModerationResponse> {
          return await makeRequest<MistralModerationResponse>(
            "/moderations",
            jsonRequest(req),
            signal
          );
        },
        {
          payloadSchema: moderationsSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, moderationsSchema);
          },
        }
      ),
      classifications: Object.assign(
        async function classifications(
          req: MistralClassificationRequest,
          signal?: AbortSignal
        ): Promise<MistralClassificationResponse> {
          return await makeRequest<MistralClassificationResponse>(
            "/classifications",
            jsonRequest(req),
            signal
          );
        },
        {
          payloadSchema: classificationsSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, classificationsSchema);
          },
        }
      ),
      models: {
        list: async function list(
          signal?: AbortSignal
        ): Promise<MistralModelListResponse> {
          return await makeGetRequest<MistralModelListResponse>(
            "/models",
            undefined,
            signal
          );
        },
        retrieve: async function retrieve(
          modelId: string,
          signal?: AbortSignal
        ): Promise<MistralModel> {
          return await makeGetRequest<MistralModel>(
            `/models/${encodeURIComponent(modelId)}`,
            undefined,
            signal
          );
        },
        del: async function del(
          modelId: string,
          signal?: AbortSignal
        ): Promise<MistralModelDeleteResponse> {
          return await makeDeleteRequest<MistralModelDeleteResponse>(
            `/models/${encodeURIComponent(modelId)}`,
            signal
          );
        },
      },
      files: {
        list: async function list(
          signal?: AbortSignal
        ): Promise<MistralFileListResponse> {
          return await makeGetRequest<MistralFileListResponse>(
            "/files",
            undefined,
            signal
          );
        },
        upload: async function upload(
          file: Blob,
          filename: string,
          purpose: string,
          signal?: AbortSignal
        ): Promise<MistralFile> {
          const form = new FormData();
          form.append("file", file, filename);
          form.append("purpose", purpose);
          return await makeRequest<MistralFile>(
            "/files",
            { headers: {}, body: form },
            signal
          );
        },
        retrieve: async function retrieve(
          fileId: string,
          signal?: AbortSignal
        ): Promise<MistralFile> {
          return await makeGetRequest<MistralFile>(
            `/files/${encodeURIComponent(fileId)}`,
            undefined,
            signal
          );
        },
        del: async function del(
          fileId: string,
          signal?: AbortSignal
        ): Promise<MistralFileDeleteResponse> {
          return await makeDeleteRequest<MistralFileDeleteResponse>(
            `/files/${encodeURIComponent(fileId)}`,
            signal
          );
        },
        content: async function content(
          fileId: string,
          signal?: AbortSignal
        ): Promise<string> {
          return await makeGetTextRequest(
            `/files/${encodeURIComponent(fileId)}/content`,
            signal
          );
        },
        url: async function url(
          fileId: string,
          signal?: AbortSignal
        ): Promise<MistralFileUrlResponse> {
          return await makeGetRequest<MistralFileUrlResponse>(
            `/files/${encodeURIComponent(fileId)}/url`,
            undefined,
            signal
          );
        },
      },
      fine_tuning: {
        jobs: Object.assign(
          async function jobs(
            req: MistralFineTuningJobCreateRequest,
            signal?: AbortSignal
          ): Promise<MistralFineTuningJob> {
            return await makeRequest<MistralFineTuningJob>(
              "/fine_tuning/jobs",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: fineTuningJobsCreateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, fineTuningJobsCreateSchema);
            },
            list: async function list(
              params?: MistralFineTuningJobListParams,
              signal?: AbortSignal
            ): Promise<MistralFineTuningJobListResponse> {
              const query: Record<string, string | undefined> = {};
              if (params?.page !== undefined) query.page = String(params.page);
              if (params?.page_size !== undefined)
                query.page_size = String(params.page_size);
              if (params?.model) query.model = params.model;
              if (params?.created_after)
                query.created_after = params.created_after;
              if (params?.created_by_me !== undefined)
                query.created_by_me = String(params.created_by_me);
              if (params?.status) query.status = params.status;
              if (params?.wandb_project)
                query.wandb_project = params.wandb_project;
              if (params?.wandb_name) query.wandb_name = params.wandb_name;
              if (params?.suffix) query.suffix = params.suffix;
              return await makeGetRequest<MistralFineTuningJobListResponse>(
                "/fine_tuning/jobs",
                query,
                signal
              );
            },
            retrieve: async function retrieve(
              jobId: string,
              signal?: AbortSignal
            ): Promise<MistralFineTuningJob> {
              return await makeGetRequest<MistralFineTuningJob>(
                `/fine_tuning/jobs/${encodeURIComponent(jobId)}`,
                undefined,
                signal
              );
            },
            cancel: async function cancel(
              jobId: string,
              signal?: AbortSignal
            ): Promise<MistralFineTuningJob> {
              return await makeEmptyPostRequest<MistralFineTuningJob>(
                `/fine_tuning/jobs/${encodeURIComponent(jobId)}/cancel`,
                signal
              );
            },
            start: async function start(
              jobId: string,
              signal?: AbortSignal
            ): Promise<MistralFineTuningJob> {
              return await makeEmptyPostRequest<MistralFineTuningJob>(
                `/fine_tuning/jobs/${encodeURIComponent(jobId)}/start`,
                signal
              );
            },
          }
        ),
        models: {
          update: async function update(
            modelId: string,
            req: MistralFineTuningModelUpdateRequest,
            signal?: AbortSignal
          ): Promise<MistralModel> {
            return await makePatchRequest<MistralModel>(
              `/fine_tuning/models/${encodeURIComponent(modelId)}`,
              jsonRequest(req),
              signal
            );
          },
          archive: async function archive(
            modelId: string,
            signal?: AbortSignal
          ): Promise<MistralFineTuningModelArchiveResponse> {
            return await makeEmptyPostRequest<MistralFineTuningModelArchiveResponse>(
              `/fine_tuning/models/${encodeURIComponent(modelId)}/archive`,
              signal
            );
          },
          unarchive: async function unarchive(
            modelId: string,
            signal?: AbortSignal
          ): Promise<MistralFineTuningModelArchiveResponse> {
            return await makeDeleteRequest<MistralFineTuningModelArchiveResponse>(
              `/fine_tuning/models/${encodeURIComponent(modelId)}/archive`,
              signal
            );
          },
        },
      },
      batch: {
        jobs: Object.assign(
          async function jobs(
            req: MistralBatchJobCreateRequest,
            signal?: AbortSignal
          ): Promise<MistralBatchJob> {
            return await makeRequest<MistralBatchJob>(
              "/batch/jobs",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: batchJobsCreateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, batchJobsCreateSchema);
            },
            list: async function list(
              params?: MistralBatchJobListParams,
              signal?: AbortSignal
            ): Promise<MistralBatchJobListResponse> {
              const query: Record<string, string | undefined> = {};
              if (params?.page !== undefined) query.page = String(params.page);
              if (params?.page_size !== undefined)
                query.page_size = String(params.page_size);
              if (params?.model) query.model = params.model;
              if (params?.created_after)
                query.created_after = params.created_after;
              if (params?.created_by_me !== undefined)
                query.created_by_me = String(params.created_by_me);
              if (params?.status) query.status = params.status;
              return await makeGetRequest<MistralBatchJobListResponse>(
                "/batch/jobs",
                query,
                signal
              );
            },
            retrieve: async function retrieve(
              jobId: string,
              signal?: AbortSignal
            ): Promise<MistralBatchJob> {
              return await makeGetRequest<MistralBatchJob>(
                `/batch/jobs/${encodeURIComponent(jobId)}`,
                undefined,
                signal
              );
            },
            cancel: async function cancel(
              jobId: string,
              signal?: AbortSignal
            ): Promise<MistralBatchJob> {
              return await makeEmptyPostRequest<MistralBatchJob>(
                `/batch/jobs/${encodeURIComponent(jobId)}/cancel`,
                signal
              );
            },
          }
        ),
      },
      audio: {
        speech: Object.assign(
          async function speech(
            req: MistralSpeechRequest,
            signal?: AbortSignal
          ): Promise<ArrayBuffer> {
            return await makeBinaryRequest(
              "/audio/speech",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: speechSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, speechSchema);
            },
          }
        ),
        transcriptions: Object.assign(
          async function transcriptions(
            req: MistralTranscriptionRequest,
            signal?: AbortSignal
          ): Promise<MistralTranscriptionResponse> {
            const form = new FormData();
            form.append("file", req.file);
            form.append("model", req.model);
            if (req.language !== undefined)
              form.append("language", req.language);
            if (req.prompt !== undefined) form.append("prompt", req.prompt);
            if (req.response_format !== undefined)
              form.append("response_format", req.response_format);
            if (req.temperature !== undefined)
              form.append("temperature", String(req.temperature));
            if (req.timestamp_granularities !== undefined) {
              for (const g of req.timestamp_granularities) {
                form.append("timestamp_granularities[]", g);
              }
            }
            return await makeRequest<MistralTranscriptionResponse>(
              "/audio/transcriptions",
              { headers: {}, body: form },
              signal
            );
          },
          {
            payloadSchema: transcriptionsSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, transcriptionsSchema);
            },
          }
        ),
        voices: {
          list: async function list(
            signal?: AbortSignal
          ): Promise<MistralVoiceListResponse> {
            return await makeGetRequest<MistralVoiceListResponse>(
              "/audio/voices",
              undefined,
              signal
            );
          },
          create: Object.assign(
            async function create(
              req: MistralVoiceCreateRequest,
              signal?: AbortSignal
            ): Promise<MistralVoice> {
              return await makeRequest<MistralVoice>(
                "/audio/voices",
                jsonRequest(req),
                signal
              );
            },
            {
              payloadSchema: voiceCreateSchema,
              validatePayload(data: unknown): ValidationResult {
                return validatePayload(data, voiceCreateSchema);
              },
            }
          ),
          retrieve: async function retrieve(
            voiceId: string,
            signal?: AbortSignal
          ): Promise<MistralVoice> {
            return await makeGetRequest<MistralVoice>(
              `/audio/voices/${encodeURIComponent(voiceId)}`,
              undefined,
              signal
            );
          },
          update: Object.assign(
            async function update(
              voiceId: string,
              req: MistralVoiceUpdateRequest,
              signal?: AbortSignal
            ): Promise<MistralVoice> {
              return await makePatchRequest<MistralVoice>(
                `/audio/voices/${encodeURIComponent(voiceId)}`,
                jsonRequest(req),
                signal
              );
            },
            {
              payloadSchema: voiceUpdateSchema,
              validatePayload(data: unknown): ValidationResult {
                return validatePayload(data, voiceUpdateSchema);
              },
            }
          ),
          del: async function del(
            voiceId: string,
            signal?: AbortSignal
          ): Promise<void> {
            await makeDeleteVoidRequest(
              `/audio/voices/${encodeURIComponent(voiceId)}`,
              signal
            );
          },
          sample: async function sample(
            voiceId: string,
            signal?: AbortSignal
          ): Promise<ArrayBuffer> {
            return await makeGetBinaryRequest(
              `/audio/voices/${encodeURIComponent(voiceId)}/sample`,
              signal
            );
          },
        },
      },
      agents: {
        list: async function list(
          signal?: AbortSignal
        ): Promise<MistralAgentListResponse> {
          return await makeGetRequest<MistralAgentListResponse>(
            "/agents",
            undefined,
            signal
          );
        },
        create: Object.assign(
          async function create(
            req: MistralAgentCreateRequest,
            signal?: AbortSignal
          ): Promise<MistralAgent> {
            return await makeRequest<MistralAgent>(
              "/agents",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: agentCreateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, agentCreateSchema);
            },
          }
        ),
        retrieve: async function retrieve(
          agentId: string,
          signal?: AbortSignal
        ): Promise<MistralAgent> {
          return await makeGetRequest<MistralAgent>(
            `/agents/${encodeURIComponent(agentId)}`,
            undefined,
            signal
          );
        },
        update: async function update(
          agentId: string,
          req: MistralAgentUpdateRequest,
          signal?: AbortSignal
        ): Promise<MistralAgent> {
          return await makePatchRequest<MistralAgent>(
            `/agents/${encodeURIComponent(agentId)}`,
            jsonRequest(req),
            signal
          );
        },
        del: async function del(
          agentId: string,
          signal?: AbortSignal
        ): Promise<void> {
          await makeDeleteVoidRequest(
            `/agents/${encodeURIComponent(agentId)}`,
            signal
          );
        },
        versions: {
          list: async function list(
            agentId: string,
            signal?: AbortSignal
          ): Promise<MistralAgentVersionListResponse> {
            return await makeGetRequest<MistralAgentVersionListResponse>(
              `/agents/${encodeURIComponent(agentId)}/versions`,
              undefined,
              signal
            );
          },
          retrieve: async function retrieve(
            agentId: string,
            version: number,
            signal?: AbortSignal
          ): Promise<MistralAgentVersion> {
            return await makeGetRequest<MistralAgentVersion>(
              `/agents/${encodeURIComponent(agentId)}/versions/${encodeURIComponent(String(version))}`,
              undefined,
              signal
            );
          },
          update: async function update(
            agentId: string,
            req: MistralAgentVersionUpdateRequest,
            signal?: AbortSignal
          ): Promise<MistralAgentVersion> {
            return await makePatchRequest<MistralAgentVersion>(
              `/agents/${encodeURIComponent(agentId)}/version`,
              jsonRequest(req),
              signal
            );
          },
        },
        aliases: {
          list: async function list(
            agentId: string,
            signal?: AbortSignal
          ): Promise<MistralAgentAliasListResponse> {
            return await makeGetRequest<MistralAgentAliasListResponse>(
              `/agents/${encodeURIComponent(agentId)}/aliases`,
              undefined,
              signal
            );
          },
          create: async function create(
            agentId: string,
            req: MistralAgentAliasCreateRequest,
            signal?: AbortSignal
          ): Promise<MistralAgentAlias> {
            return await makePutRequest<MistralAgentAlias>(
              `/agents/${encodeURIComponent(agentId)}/aliases`,
              jsonRequest(req),
              signal
            );
          },
          del: async function del(
            agentId: string,
            req: MistralAgentAliasDeleteRequest,
            signal?: AbortSignal
          ): Promise<void> {
            await makeDeleteVoidRequest(
              `/agents/${encodeURIComponent(agentId)}/aliases`,
              signal
            );
            // req.alias is used for identification but the API uses the path
            void req;
          },
        },
        completions: Object.assign(
          async function completions(
            req: MistralAgentCompletionRequest,
            signal?: AbortSignal
          ): Promise<MistralAgentCompletionResponse> {
            return await makeRequest<MistralAgentCompletionResponse>(
              "/agents/completions",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: agentCompletionsSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, agentCompletionsSchema);
            },
          }
        ),
      },
      conversations: {
        list: async function list(
          params?: MistralConversationListParams,
          signal?: AbortSignal
        ): Promise<MistralConversationListResponse> {
          const query: Record<string, string | undefined> = {};
          if (params?.agent_id) query.agent_id = params.agent_id;
          if (params?.page !== undefined) query.page = String(params.page);
          if (params?.page_size !== undefined)
            query.page_size = String(params.page_size);
          if (params?.created_after) query.created_after = params.created_after;
          return await makeGetRequest<MistralConversationListResponse>(
            "/conversations",
            query,
            signal
          );
        },
        create: Object.assign(
          async function create(
            req: MistralConversationCreateRequest,
            signal?: AbortSignal
          ): Promise<MistralConversation> {
            return await makeRequest<MistralConversation>(
              "/conversations",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: conversationCreateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, conversationCreateSchema);
            },
          }
        ),
        retrieve: async function retrieve(
          conversationId: string,
          signal?: AbortSignal
        ): Promise<MistralConversation> {
          return await makeGetRequest<MistralConversation>(
            `/conversations/${encodeURIComponent(conversationId)}`,
            undefined,
            signal
          );
        },
        del: async function del(
          conversationId: string,
          signal?: AbortSignal
        ): Promise<void> {
          await makeDeleteVoidRequest(
            `/conversations/${encodeURIComponent(conversationId)}`,
            signal
          );
        },
        append: Object.assign(
          async function append(
            conversationId: string,
            req: MistralConversationAppendRequest,
            signal?: AbortSignal
          ): Promise<MistralConversation> {
            return await makeRequest<MistralConversation>(
              `/conversations/${encodeURIComponent(conversationId)}`,
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: conversationAppendSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, conversationAppendSchema);
            },
          }
        ),
        history: async function history(
          conversationId: string,
          signal?: AbortSignal
        ): Promise<MistralConversationHistory> {
          return await makeGetRequest<MistralConversationHistory>(
            `/conversations/${encodeURIComponent(conversationId)}/history`,
            undefined,
            signal
          );
        },
        messages: async function messages(
          conversationId: string,
          signal?: AbortSignal
        ): Promise<MistralConversationMessagesResponse> {
          return await makeGetRequest<MistralConversationMessagesResponse>(
            `/conversations/${encodeURIComponent(conversationId)}/messages`,
            undefined,
            signal
          );
        },
        restart: Object.assign(
          async function restart(
            conversationId: string,
            signal?: AbortSignal
          ): Promise<MistralConversation> {
            return await makeEmptyPostRequest<MistralConversation>(
              `/conversations/${encodeURIComponent(conversationId)}/restart`,
              signal
            );
          },
          {
            payloadSchema: conversationRestartSchema,
          }
        ),
      },
      libraries: {
        list: async function list(
          signal?: AbortSignal
        ): Promise<MistralLibraryListResponse> {
          return await makeGetRequest<MistralLibraryListResponse>(
            "/libraries",
            undefined,
            signal
          );
        },
        create: Object.assign(
          async function create(
            req: MistralLibraryCreateRequest,
            signal?: AbortSignal
          ): Promise<MistralLibrary> {
            return await makeRequest<MistralLibrary>(
              "/libraries",
              jsonRequest(req),
              signal
            );
          },
          {
            payloadSchema: libraryCreateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, libraryCreateSchema);
            },
          }
        ),
        retrieve: async function retrieve(
          libraryId: string,
          signal?: AbortSignal
        ): Promise<MistralLibrary> {
          return await makeGetRequest<MistralLibrary>(
            `/libraries/${encodeURIComponent(libraryId)}`,
            undefined,
            signal
          );
        },
        update: async function update(
          libraryId: string,
          req: MistralLibraryUpdateRequest,
          signal?: AbortSignal
        ): Promise<MistralLibrary> {
          return await makePutRequest<MistralLibrary>(
            `/libraries/${encodeURIComponent(libraryId)}`,
            jsonRequest(req),
            signal
          );
        },
        del: async function del(
          libraryId: string,
          signal?: AbortSignal
        ): Promise<void> {
          await makeDeleteVoidRequest(
            `/libraries/${encodeURIComponent(libraryId)}`,
            signal
          );
        },
        share: {
          list: async function list(
            libraryId: string,
            signal?: AbortSignal
          ): Promise<MistralLibraryAccessListResponse> {
            return await makeGetRequest<MistralLibraryAccessListResponse>(
              `/libraries/${encodeURIComponent(libraryId)}/share`,
              undefined,
              signal
            );
          },
          create: async function create(
            libraryId: string,
            req: MistralLibraryAccessCreateRequest,
            signal?: AbortSignal
          ): Promise<MistralLibraryAccess> {
            return await makePutRequest<MistralLibraryAccess>(
              `/libraries/${encodeURIComponent(libraryId)}/share`,
              jsonRequest(req),
              signal
            );
          },
          del: async function del(
            libraryId: string,
            req: MistralLibraryAccessDeleteRequest,
            signal?: AbortSignal
          ): Promise<void> {
            await makeDeleteVoidRequest(
              `/libraries/${encodeURIComponent(libraryId)}/share`,
              signal
            );
            void req;
          },
        },
        documents: {
          list: async function list(
            libraryId: string,
            params?: MistralLibraryDocumentListParams,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocumentListResponse> {
            const query: Record<string, string | undefined> = {};
            if (params?.page !== undefined) query.page = String(params.page);
            if (params?.page_size !== undefined)
              query.page_size = String(params.page_size);
            return await makeGetRequest<MistralLibraryDocumentListResponse>(
              `/libraries/${encodeURIComponent(libraryId)}/documents`,
              query,
              signal
            );
          },
          upload: async function upload(
            libraryId: string,
            file: Blob,
            filename: string,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocument> {
            const form = new FormData();
            form.append("file", file, filename);
            return await makeRequest<MistralLibraryDocument>(
              `/libraries/${encodeURIComponent(libraryId)}/documents`,
              { headers: {}, body: form },
              signal
            );
          },
          retrieve: async function retrieve(
            libraryId: string,
            documentId: string,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocument> {
            return await makeGetRequest<MistralLibraryDocument>(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}`,
              undefined,
              signal
            );
          },
          update: async function update(
            libraryId: string,
            documentId: string,
            req: MistralLibraryDocumentUpdateRequest,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocument> {
            return await makePutRequest<MistralLibraryDocument>(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}`,
              jsonRequest(req),
              signal
            );
          },
          del: async function del(
            libraryId: string,
            documentId: string,
            signal?: AbortSignal
          ): Promise<void> {
            await makeDeleteVoidRequest(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}`,
              signal
            );
          },
          textContent: async function textContent(
            libraryId: string,
            documentId: string,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocumentTextContent> {
            return await makeGetRequest<MistralLibraryDocumentTextContent>(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}/text_content`,
              undefined,
              signal
            );
          },
          status: async function status(
            libraryId: string,
            documentId: string,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocumentStatus> {
            return await makeGetRequest<MistralLibraryDocumentStatus>(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}/status`,
              undefined,
              signal
            );
          },
          signedUrl: async function signedUrl(
            libraryId: string,
            documentId: string,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocumentSignedUrl> {
            return await makeGetRequest<MistralLibraryDocumentSignedUrl>(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}/signed-url`,
              undefined,
              signal
            );
          },
          extractedTextSignedUrl: async function extractedTextSignedUrl(
            libraryId: string,
            documentId: string,
            signal?: AbortSignal
          ): Promise<MistralLibraryDocumentSignedUrl> {
            return await makeGetRequest<MistralLibraryDocumentSignedUrl>(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}/extracted-text-signed-url`,
              undefined,
              signal
            );
          },
          reprocess: async function reprocess(
            libraryId: string,
            documentId: string,
            signal?: AbortSignal
          ): Promise<void> {
            await makeEmptyPostRequest<unknown>(
              `/libraries/${encodeURIComponent(libraryId)}/documents/${encodeURIComponent(documentId)}/reprocess`,
              signal
            );
          },
        },
      },
    },
  };
}
