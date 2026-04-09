import {
  FreeOptions,
  TmpfilesUploadRequest,
  TmpfilesUploadResponse,
  UguuUploadRequest,
  UguuUploadResponse,
  FreeProvider,
  FreeError,
} from "./types";
import type { ValidationResult } from "./types";
import { tmpfilesUploadSchema, uguuUploadSchema } from "./schemas";
import { validatePayload } from "./validate";

export function free(opts?: FreeOptions): FreeProvider {
  const doFetch = opts?.fetch ?? fetch;
  const timeout = opts?.timeout ?? 30000;

  function attachAbortHandler(
    signal: AbortSignal,
    controller: AbortController
  ): void {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  async function makeFormRequest<T>(
    url: string,
    form: FormData,
    signal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      attachAbortHandler(signal, controller);
    }

    try {
      const res = await doFetch(url, {
        method: "POST",
        headers: {},
        body: form,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const message = `Free API error: ${res.status}`;
        let resBody: unknown = null;
        try {
          resBody = await res.json();
        } catch {
          // ignore parse errors
        }
        throw new FreeError(message, res.status, resBody);
      }

      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof FreeError) throw error;
      throw new FreeError(`Free request failed: ${error}`, 500);
    }
  }

  // -- tmpfiles.org -----------------------------------------------------------

  const tmpfilesApiV1 = {
    upload: Object.assign(
      async (
        req: TmpfilesUploadRequest,
        signal?: AbortSignal
      ): Promise<TmpfilesUploadResponse> => {
        const form = new FormData();
        form.append("file", req.file, req.filename ?? "upload");
        return makeFormRequest<TmpfilesUploadResponse>(
          "https://tmpfiles.org/api/v1/upload",
          form,
          signal
        );
      },
      {
        payloadSchema: tmpfilesUploadSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, tmpfilesUploadSchema);
        },
      }
    ),
  };

  // -- uguu.se ----------------------------------------------------------------

  const uguu = {
    upload: Object.assign(
      async (
        req: UguuUploadRequest,
        signal?: AbortSignal
      ): Promise<UguuUploadResponse> => {
        const form = new FormData();
        form.append("files[]", req.file, req.filename ?? "upload");
        return makeFormRequest<UguuUploadResponse>(
          "https://uguu.se/upload",
          form,
          signal
        );
      },
      {
        payloadSchema: uguuUploadSchema,
        validatePayload(data: unknown): ValidationResult {
          return validatePayload(data, uguuUploadSchema);
        },
      }
    ),
  };

  // -- Provider ---------------------------------------------------------------

  return {
    tmpfiles: {
      api: {
        v1: tmpfilesApiV1,
      },
    },
    uguu,
  };
}
