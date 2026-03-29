import {
  GeminiOptions,
  GeminiGenerateContentRequest,
  GeminiGenerateContentResponse,
  GeminiCountTokensRequest,
  GeminiCountTokensResponse,
  GeminiEmbedContentRequest,
  GeminiEmbedContentResponse,
  GeminiBatchEmbedContentsRequest,
  GeminiBatchEmbedContentsResponse,
  GeminiPredictRequest,
  GeminiPredictResponse,
  GeminiPredictLongRunningRequest,
  GeminiOperation,
  GeminiBatchGenerateContentRequest,
  GeminiBatchGenerateContentResponse,
  GeminiModel,
  GeminiModelListResponse,
  GeminiFileUploadRequest,
  GeminiFileUploadResponse,
  GeminiFileCreateRequest,
  GeminiFile,
  GeminiFileListParams,
  GeminiFileListResponse,
  GeminiCachedContent,
  GeminiCachedContentCreateRequest,
  GeminiCachedContentUpdateRequest,
  GeminiCachedContentListParams,
  GeminiCachedContentListResponse,
  GeminiTunedModel,
  GeminiTunedModelCreateRequest,
  GeminiTunedModelUpdateRequest,
  GeminiTunedModelListParams,
  GeminiTunedModelListResponse,
  GeminiTransferOwnershipRequest,
  GeminiPermission,
  GeminiPermissionListParams,
  GeminiPermissionListResponse,
  GeminiBatch,
  GeminiBatchListParams,
  GeminiBatchListResponse,
  GeminiProvider,
  GeminiError,
} from "./types";
import type { ValidationResult } from "./types";
import {
  generateContentSchema,
  streamGenerateContentSchema,
  countTokensSchema,
  embedContentSchema,
  batchEmbedContentsSchema,
  predictSchema,
  predictLongRunningSchema,
  batchGenerateContentSchema,
  cachedContentCreateSchema,
  tunedModelCreateSchema,
} from "./schemas";
import { validatePayload } from "./validate";
import { sseToIterable } from "./sse";

function resolveModel(model: string): string {
  // If already has "models/" prefix, strip it for the URL segment
  return model.startsWith("models/") ? model.slice(7) : model;
}

function stripModel<T extends { model: string }>(req: T): Omit<T, "model"> {
  const result = { ...req };
  delete (result as Record<string, unknown>).model;
  return result as Omit<T, "model">;
}

function resolveName(name: string, prefix: string): string {
  // Ensure name has the correct prefix for URL construction
  return name.startsWith(`${prefix}/`) ? name : `${prefix}/${name}`;
}

export function googleGemini(opts: GeminiOptions): GeminiProvider {
  const baseURL =
    opts.baseURL ?? "https://generativelanguage.googleapis.com/v1beta";
  const doFetch = opts.fetch ?? fetch;
  const timeout = opts.timeout ?? 30000;

  async function makeRequest<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const headers: Record<string, string> = {
        "x-goog-api-key": opts.apiKey,
      };
      const init: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
      }

      const res = await doFetch(`${baseURL}${path}`, init);

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Gemini API error: ${res.status}`;
        let errBody: unknown = null;
        try {
          errBody = await res.json();
          if (
            typeof errBody === "object" &&
            errBody !== null &&
            "error" in errBody
          ) {
            const err = (errBody as { error: { message?: string } }).error;
            if (err?.message) {
              message = `Gemini API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new GeminiError(message, res.status, errBody);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof GeminiError) throw error;
      throw new GeminiError(`Gemini request failed: ${error}`, 500);
    }
  }

  async function makeStreamRequest(
    path: string,
    body: unknown,
    signal?: AbortSignal
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const headers: Record<string, string> = {
        "x-goog-api-key": opts.apiKey,
        "Content-Type": "application/json",
      };

      const res = await doFetch(`${baseURL}${path}?alt=sse`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Gemini API error: ${res.status}`;
        let errBody: unknown = null;
        try {
          errBody = await res.json();
          if (
            typeof errBody === "object" &&
            errBody !== null &&
            "error" in errBody
          ) {
            const err = (errBody as { error: { message?: string } }).error;
            if (err?.message) {
              message = `Gemini API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new GeminiError(message, res.status, errBody);
      }

      return res;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof GeminiError) throw error;
      throw new GeminiError(`Gemini request failed: ${error}`, 500);
    }
  }

  async function makeUploadRequest(
    req: GeminiFileUploadRequest,
    signal?: AbortSignal
  ): Promise<GeminiFileUploadResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      // Gemini file upload uses a separate /upload base path
      const uploadURL = baseURL.replace("/v1beta", "/upload/v1beta");

      const formData = new FormData();

      // Add metadata as JSON
      const metadata: Record<string, string> = {};
      if (req.displayName) metadata.displayName = req.displayName;
      formData.append(
        "metadata",
        new Blob([JSON.stringify({ file: metadata })], {
          type: "application/json",
        })
      );

      formData.append("file", req.file);

      const res = await doFetch(`${uploadURL}/files`, {
        method: "POST",
        headers: {
          "x-goog-api-key": opts.apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let message = `Gemini API error: ${res.status}`;
        let errBody: unknown = null;
        try {
          errBody = await res.json();
          if (
            typeof errBody === "object" &&
            errBody !== null &&
            "error" in errBody
          ) {
            const err = (errBody as { error: { message?: string } }).error;
            if (err?.message) {
              message = `Gemini API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new GeminiError(message, res.status, errBody);
      }

      return (await res.json()) as GeminiFileUploadResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof GeminiError) throw error;
      throw new GeminiError(`Gemini request failed: ${error}`, 500);
    }
  }

  function buildQuery(params: object): string {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        );
      }
    }
    return parts.length > 0 ? `?${parts.join("&")}` : "";
  }

  // --- Models namespace ---

  async function modelsCallable(
    modelIdOrSignal?: string | AbortSignal,
    signal?: AbortSignal
  ): Promise<GeminiModelListResponse | GeminiModel> {
    if (typeof modelIdOrSignal === "string") {
      const model = resolveModel(modelIdOrSignal);
      return makeRequest<GeminiModel>(
        "GET",
        `/models/${model}`,
        undefined,
        signal
      );
    }
    return makeRequest<GeminiModelListResponse>(
      "GET",
      "/models",
      undefined,
      modelIdOrSignal
    );
  }

  const models = Object.assign(modelsCallable, {
    generateContent: Object.assign(
      async function generateContent(
        req: GeminiGenerateContentRequest,
        signal?: AbortSignal
      ): Promise<GeminiGenerateContentResponse> {
        const model = resolveModel(req.model);
        const body = stripModel(req);
        return await makeRequest<GeminiGenerateContentResponse>(
          "POST",
          `/models/${model}:generateContent`,
          body,
          signal
        );
      },
      {
        payloadSchema: generateContentSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, generateContentSchema);
        },
      }
    ),

    streamGenerateContent: Object.assign(
      async function* streamGenerateContent(
        req: GeminiGenerateContentRequest,
        signal?: AbortSignal
      ): AsyncGenerator<GeminiGenerateContentResponse> {
        const model = resolveModel(req.model);
        const body = stripModel(req);
        const res = await makeStreamRequest(
          `/models/${model}:streamGenerateContent`,
          body,
          signal
        );

        for await (const event of sseToIterable(res)) {
          if (event.data === "[DONE]") break;
          try {
            yield JSON.parse(event.data) as GeminiGenerateContentResponse;
          } catch {
            // skip unparseable chunks
          }
        }
      },
      {
        payloadSchema: streamGenerateContentSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, streamGenerateContentSchema);
        },
      }
    ),

    countTokens: Object.assign(
      async function countTokens(
        req: GeminiCountTokensRequest,
        signal?: AbortSignal
      ): Promise<GeminiCountTokensResponse> {
        const model = resolveModel(req.model);
        const body = stripModel(req);
        return await makeRequest<GeminiCountTokensResponse>(
          "POST",
          `/models/${model}:countTokens`,
          body,
          signal
        );
      },
      {
        payloadSchema: countTokensSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, countTokensSchema);
        },
      }
    ),

    embedContent: Object.assign(
      async function embedContent(
        req: GeminiEmbedContentRequest,
        signal?: AbortSignal
      ): Promise<GeminiEmbedContentResponse> {
        const model = resolveModel(req.model);
        const body = stripModel(req);
        return await makeRequest<GeminiEmbedContentResponse>(
          "POST",
          `/models/${model}:embedContent`,
          body,
          signal
        );
      },
      {
        payloadSchema: embedContentSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, embedContentSchema);
        },
      }
    ),

    batchEmbedContents: Object.assign(
      async function batchEmbedContents(
        req: GeminiBatchEmbedContentsRequest,
        signal?: AbortSignal
      ): Promise<GeminiBatchEmbedContentsResponse> {
        const model = resolveModel(req.model);
        const modelPath = `models/${model}`;
        // API requires each sub-request to include the full model path
        const requests = req.requests.map((r) => ({
          ...r,
          model: modelPath,
        }));
        return await makeRequest<GeminiBatchEmbedContentsResponse>(
          "POST",
          `/models/${model}:batchEmbedContents`,
          { requests },
          signal
        );
      },
      {
        payloadSchema: batchEmbedContentsSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, batchEmbedContentsSchema);
        },
      }
    ),

    predict: Object.assign(
      async function predict(
        req: GeminiPredictRequest,
        signal?: AbortSignal
      ): Promise<GeminiPredictResponse> {
        const model = resolveModel(req.model);
        const body = stripModel(req);
        return await makeRequest<GeminiPredictResponse>(
          "POST",
          `/models/${model}:predict`,
          body,
          signal
        );
      },
      {
        payloadSchema: predictSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, predictSchema);
        },
      }
    ),

    predictLongRunning: Object.assign(
      async function predictLongRunning(
        req: GeminiPredictLongRunningRequest,
        signal?: AbortSignal
      ): Promise<GeminiOperation> {
        const model = resolveModel(req.model);
        const body = stripModel(req);
        return await makeRequest<GeminiOperation>(
          "POST",
          `/models/${model}:predictLongRunning`,
          body,
          signal
        );
      },
      {
        payloadSchema: predictLongRunningSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, predictLongRunningSchema);
        },
      }
    ),

    batchGenerateContent: Object.assign(
      async function batchGenerateContent(
        req: GeminiBatchGenerateContentRequest,
        signal?: AbortSignal
      ): Promise<GeminiBatchGenerateContentResponse> {
        const model = resolveModel(req.model);
        const body = stripModel(req);
        return await makeRequest<GeminiBatchGenerateContentResponse>(
          "POST",
          `/models/${model}:batchGenerateContent`,
          body,
          signal
        );
      },
      {
        payloadSchema: batchGenerateContentSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, batchGenerateContentSchema);
        },
      }
    ),
  });

  // --- Files namespace ---

  const files = {
    async upload(
      req: GeminiFileUploadRequest,
      signal?: AbortSignal
    ): Promise<GeminiFileUploadResponse> {
      return await makeUploadRequest(req, signal);
    },

    async create(
      req: GeminiFileCreateRequest,
      signal?: AbortSignal
    ): Promise<GeminiFile> {
      return await makeRequest<GeminiFile>("POST", "/files", req, signal);
    },

    async get(name: string, signal?: AbortSignal): Promise<GeminiFile> {
      const resolved = resolveName(name, "files");
      return await makeRequest<GeminiFile>(
        "GET",
        `/${resolved}`,
        undefined,
        signal
      );
    },

    async list(
      params?: GeminiFileListParams,
      signal?: AbortSignal
    ): Promise<GeminiFileListResponse> {
      const query = buildQuery(params ?? {});
      return await makeRequest<GeminiFileListResponse>(
        "GET",
        `/files${query}`,
        undefined,
        signal
      );
    },

    async delete(name: string, signal?: AbortSignal): Promise<void> {
      const resolved = resolveName(name, "files");
      await makeRequest<Record<string, never>>(
        "DELETE",
        `/${resolved}`,
        undefined,
        signal
      );
    },
  };

  // --- Cached Contents namespace ---

  const cachedContents = {
    create: Object.assign(
      async function create(
        req: GeminiCachedContentCreateRequest,
        signal?: AbortSignal
      ): Promise<GeminiCachedContent> {
        return await makeRequest<GeminiCachedContent>(
          "POST",
          "/cachedContents",
          req,
          signal
        );
      },
      {
        payloadSchema: cachedContentCreateSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, cachedContentCreateSchema);
        },
      }
    ),

    async get(
      name: string,
      signal?: AbortSignal
    ): Promise<GeminiCachedContent> {
      const resolved = resolveName(name, "cachedContents");
      return await makeRequest<GeminiCachedContent>(
        "GET",
        `/${resolved}`,
        undefined,
        signal
      );
    },

    async list(
      params?: GeminiCachedContentListParams,
      signal?: AbortSignal
    ): Promise<GeminiCachedContentListResponse> {
      const query = buildQuery(params ?? {});
      return await makeRequest<GeminiCachedContentListResponse>(
        "GET",
        `/cachedContents${query}`,
        undefined,
        signal
      );
    },

    async update(
      name: string,
      req: GeminiCachedContentUpdateRequest,
      updateMask?: string,
      signal?: AbortSignal
    ): Promise<GeminiCachedContent> {
      const resolved = resolveName(name, "cachedContents");
      const maskQuery = updateMask ? `?updateMask=${updateMask}` : "";
      return await makeRequest<GeminiCachedContent>(
        "PATCH",
        `/${resolved}${maskQuery}`,
        req,
        signal
      );
    },

    async delete(name: string, signal?: AbortSignal): Promise<void> {
      const resolved = resolveName(name, "cachedContents");
      await makeRequest<Record<string, never>>(
        "DELETE",
        `/${resolved}`,
        undefined,
        signal
      );
    },
  };

  // --- Tuned Model Permissions ---

  const permissions = {
    async create(
      parent: string,
      req: GeminiPermission,
      signal?: AbortSignal
    ): Promise<GeminiPermission> {
      const resolved = resolveName(parent, "tunedModels");
      return await makeRequest<GeminiPermission>(
        "POST",
        `/${resolved}/permissions`,
        req,
        signal
      );
    },

    async get(name: string, signal?: AbortSignal): Promise<GeminiPermission> {
      // name format: tunedModels/{id}/permissions/{id}
      return await makeRequest<GeminiPermission>(
        "GET",
        `/${name}`,
        undefined,
        signal
      );
    },

    async list(
      parent: string,
      params?: GeminiPermissionListParams,
      signal?: AbortSignal
    ): Promise<GeminiPermissionListResponse> {
      const resolved = resolveName(parent, "tunedModels");
      const query = buildQuery(params ?? {});
      return await makeRequest<GeminiPermissionListResponse>(
        "GET",
        `/${resolved}/permissions${query}`,
        undefined,
        signal
      );
    },

    async update(
      name: string,
      req: GeminiPermission,
      updateMask?: string,
      signal?: AbortSignal
    ): Promise<GeminiPermission> {
      // name format: tunedModels/{id}/permissions/{id}
      const maskQuery = updateMask ? `?updateMask=${updateMask}` : "";
      return await makeRequest<GeminiPermission>(
        "PATCH",
        `/${name}${maskQuery}`,
        req,
        signal
      );
    },

    async delete(name: string, signal?: AbortSignal): Promise<void> {
      // name format: tunedModels/{id}/permissions/{id}
      await makeRequest<Record<string, never>>(
        "DELETE",
        `/${name}`,
        undefined,
        signal
      );
    },
  };

  // --- Tuned Models namespace ---

  const tunedModels = {
    create: Object.assign(
      async function create(
        req: GeminiTunedModelCreateRequest,
        signal?: AbortSignal
      ): Promise<GeminiOperation> {
        return await makeRequest<GeminiOperation>(
          "POST",
          "/tunedModels",
          req,
          signal
        );
      },
      {
        payloadSchema: tunedModelCreateSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, tunedModelCreateSchema);
        },
      }
    ),

    async get(name: string, signal?: AbortSignal): Promise<GeminiTunedModel> {
      const resolved = resolveName(name, "tunedModels");
      return await makeRequest<GeminiTunedModel>(
        "GET",
        `/${resolved}`,
        undefined,
        signal
      );
    },

    async list(
      params?: GeminiTunedModelListParams,
      signal?: AbortSignal
    ): Promise<GeminiTunedModelListResponse> {
      const query = buildQuery(params ?? {});
      return await makeRequest<GeminiTunedModelListResponse>(
        "GET",
        `/tunedModels${query}`,
        undefined,
        signal
      );
    },

    async update(
      name: string,
      req: GeminiTunedModelUpdateRequest,
      updateMask?: string,
      signal?: AbortSignal
    ): Promise<GeminiTunedModel> {
      const resolved = resolveName(name, "tunedModels");
      const maskQuery = updateMask ? `?updateMask=${updateMask}` : "";
      return await makeRequest<GeminiTunedModel>(
        "PATCH",
        `/${resolved}${maskQuery}`,
        req,
        signal
      );
    },

    async delete(name: string, signal?: AbortSignal): Promise<void> {
      const resolved = resolveName(name, "tunedModels");
      await makeRequest<Record<string, never>>(
        "DELETE",
        `/${resolved}`,
        undefined,
        signal
      );
    },

    generateContent: Object.assign(
      async function generateContent(
        req: GeminiGenerateContentRequest,
        signal?: AbortSignal
      ): Promise<GeminiGenerateContentResponse> {
        // For tuned models, the model field should be tunedModels/{id}
        const resolved = resolveName(req.model, "tunedModels");
        const body = stripModel(req);
        return await makeRequest<GeminiGenerateContentResponse>(
          "POST",
          `/${resolved}:generateContent`,
          body,
          signal
        );
      },
      {
        payloadSchema: generateContentSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, generateContentSchema);
        },
      }
    ),

    async transferOwnership(
      name: string,
      req: GeminiTransferOwnershipRequest,
      signal?: AbortSignal
    ): Promise<void> {
      const resolved = resolveName(name, "tunedModels");
      await makeRequest<Record<string, never>>(
        "POST",
        `/${resolved}:transferOwnership`,
        req,
        signal
      );
    },

    permissions,
  };

  // --- Batches namespace ---

  const batches = {
    async get(name: string, signal?: AbortSignal): Promise<GeminiBatch> {
      const resolved = resolveName(name, "batches");
      return await makeRequest<GeminiBatch>(
        "GET",
        `/${resolved}`,
        undefined,
        signal
      );
    },

    async list(
      params?: GeminiBatchListParams,
      signal?: AbortSignal
    ): Promise<GeminiBatchListResponse> {
      const query = buildQuery(params ?? {});
      return await makeRequest<GeminiBatchListResponse>(
        "GET",
        `/batches${query}`,
        undefined,
        signal
      );
    },

    async cancel(name: string, signal?: AbortSignal): Promise<GeminiBatch> {
      const resolved = resolveName(name, "batches");
      return await makeRequest<GeminiBatch>(
        "POST",
        `/${resolved}:cancel`,
        {},
        signal
      );
    },

    async delete(name: string, signal?: AbortSignal): Promise<void> {
      const resolved = resolveName(name, "batches");
      await makeRequest<Record<string, never>>(
        "DELETE",
        `/${resolved}`,
        undefined,
        signal
      );
    },
  };

  // --- Operations namespace ---

  const operations = {
    async get(name: string, signal?: AbortSignal): Promise<GeminiOperation> {
      // name is the full operation name, e.g. "operations/abc123"
      return await makeRequest<GeminiOperation>(
        "GET",
        `/${name}`,
        undefined,
        signal
      );
    },

    async cancel(name: string, signal?: AbortSignal): Promise<void> {
      await makeRequest<Record<string, never>>(
        "POST",
        `/${name}:cancel`,
        {},
        signal
      );
    },
  };

  return {
    v1beta: {
      models: models as GeminiProvider["v1beta"]["models"],
      files,
      cachedContents,
      tunedModels,
      batches,
      operations,
    },
  };
}
