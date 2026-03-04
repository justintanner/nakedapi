import { KieError } from "./types";

interface KieApiResponse {
  code: number;
  msg: string;
  data?: Record<string, unknown>;
}

function isKieApiResponse(value: unknown): value is KieApiResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof (value as KieApiResponse).code === "number"
  );
}

export async function kieRequest<T>(
  url: string,
  opts: {
    method: "GET" | "POST";
    apiKey: string;
    body?: unknown;
    timeout: number;
    doFetch: typeof fetch;
    signal?: AbortSignal;
  }
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
    };

    const init: RequestInit = {
      method: opts.method,
      headers,
      signal: controller.signal,
    };

    if (opts.body !== undefined) {
      init.body = JSON.stringify(opts.body);
    }

    const res = await opts.doFetch(url, init);

    clearTimeout(timeoutId);

    if (!res.ok) {
      let message = `Kie API error: ${res.status}`;
      try {
        const errorData: unknown = await res.json();
        if (
          typeof errorData === "object" &&
          errorData !== null &&
          "msg" in errorData &&
          typeof (errorData as { msg?: string }).msg === "string"
        ) {
          message = `Kie API error ${res.status}: ${(errorData as { msg: string }).msg}`;
        }
      } catch {
        // ignore parse errors
      }
      throw new KieError(message, res.status);
    }

    const data: unknown = await res.json();

    if (isKieApiResponse(data) && data.code !== 200) {
      throw new KieError(data.msg || `API error: ${data.code}`, data.code);
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof KieError) throw error;
    throw new KieError(`Request failed: ${error}`, 500);
  }
}
