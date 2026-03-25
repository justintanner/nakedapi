import {
  OpenAiOptions,
  OpenAiChatRequest,
  OpenAiChatResponse,
  OpenAiTranscribeRequest,
  OpenAiTranscribeResponse,
  OpenAiProvider,
  OpenAiError,
} from "./types";

export function openai(opts: OpenAiOptions): OpenAiProvider {
  const baseURL = opts.baseURL ?? "https://api.openai.com/v1";
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
        let message = `OpenAI API error: ${res.status}`;
        try {
          const errorData: unknown = await res.json();
          if (
            typeof errorData === "object" &&
            errorData !== null &&
            "error" in errorData
          ) {
            const err = (errorData as { error: { message?: string } }).error;
            if (err?.message) {
              message = `OpenAI API error ${res.status}: ${err.message}`;
            }
          }
        } catch {
          // ignore parse errors
        }
        throw new OpenAiError(message, res.status);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof OpenAiError) throw error;
      throw new OpenAiError(`OpenAI request failed: ${error}`, 500);
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

  return {
    v1: {
      chat: {
        async completions(
          req: OpenAiChatRequest,
          signal?: AbortSignal
        ): Promise<OpenAiChatResponse> {
          const data = await makeRequest<OpenAiChatResponse>(
            "/chat/completions",
            jsonRequest(req),
            signal
          );
          if (data.error) {
            throw new OpenAiError(
              data.error.message ?? "Unknown API error",
              500
            );
          }
          return data;
        },
      },
      audio: {
        async transcriptions(
          req: OpenAiTranscribeRequest,
          signal?: AbortSignal
        ): Promise<OpenAiTranscribeResponse> {
          const form = new FormData();
          form.append("file", req.file);
          form.append("model", req.model);
          form.append("response_format", "json");
          if (req.language !== undefined) form.append("language", req.language);
          if (req.prompt !== undefined) form.append("prompt", req.prompt);
          if (req.temperature !== undefined)
            form.append("temperature", String(req.temperature));

          const data = await makeRequest<OpenAiTranscribeResponse>(
            "/audio/transcriptions",
            { headers: {}, body: form },
            signal
          );
          return data;
        },
      },
    },
  };
}
