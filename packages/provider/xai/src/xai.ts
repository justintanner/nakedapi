import {
  XaiOptions,
  XaiChatRequest,
  XaiChatResponse,
  XaiImageGenerateRequest,
  XaiImageEditRequest,
  XaiImageResponse,
  XaiVideoGenerateRequest,
  XaiVideoExtendRequest,
  XaiVideoAsyncResponse,
  XaiVideoResult,
  XaiProvider,
  XaiError,
} from "./types";

export function xai(opts: XaiOptions): XaiProvider {
  const baseURL = opts.baseURL ?? "https://api.x.ai/v1";
  const doFetch = opts.fetch ?? fetch;
  const timeout = opts.timeout ?? 30000;

  async function makeRequest<T>(
    method: "GET" | "POST",
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
        Authorization: `Bearer ${opts.apiKey}`,
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
        let message = `XAI API error: ${res.status}`;
        try {
          const errorData: unknown = await res.json();
          if (
            typeof errorData === "object" &&
            errorData !== null &&
            "error" in errorData
          ) {
            const err = (errorData as { error: { message?: string } }).error;
            if (err?.message) {
              message = `XAI API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new XaiError(message, res.status);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof XaiError) throw error;
      throw new XaiError(`XAI request failed: ${error}`, 500);
    }
  }

  const videos = Object.assign(
    async function videos(
      requestId: string,
      signal?: AbortSignal
    ): Promise<XaiVideoResult> {
      return await makeRequest(
        "GET",
        `/videos/${requestId}`,
        undefined,
        signal
      );
    },
    {
      async generations(
        req: XaiVideoGenerateRequest,
        signal?: AbortSignal
      ): Promise<XaiVideoAsyncResponse> {
        return await makeRequest("POST", "/videos/generations", req, signal);
      },

      async extensions(
        req: XaiVideoExtendRequest,
        signal?: AbortSignal
      ): Promise<XaiVideoAsyncResponse> {
        return await makeRequest("POST", "/videos/extensions", req, signal);
      },
    }
  );

  return {
    v1: {
      chat: {
        async completions(
          req: XaiChatRequest,
          signal?: AbortSignal
        ): Promise<XaiChatResponse> {
          const data = await makeRequest<XaiChatResponse>(
            "POST",
            "/chat/completions",
            req,
            signal
          );
          if (data.error) {
            throw new XaiError(data.error.message ?? "Unknown API error", 500);
          }
          return data;
        },
      },
      images: {
        async generations(
          req: XaiImageGenerateRequest,
          signal?: AbortSignal
        ): Promise<XaiImageResponse> {
          return await makeRequest("POST", "/images/generations", req, signal);
        },

        async edits(
          req: XaiImageEditRequest,
          signal?: AbortSignal
        ): Promise<XaiImageResponse> {
          return await makeRequest("POST", "/images/edits", req, signal);
        },
      },
      videos,
    },
  };
}
