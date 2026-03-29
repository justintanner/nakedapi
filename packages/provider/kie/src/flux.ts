import { kieRequest } from "./request";
import type { PayloadSchema, ValidationResult } from "./types";
import { fluxKontextGenerateSchema } from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export type FluxKontextModel = "flux-kontext-pro" | "flux-kontext-max";

export interface FluxKontextGenerateRequest {
  prompt: string;
  inputImage?: string;
  aspectRatio?: string;
  model?: FluxKontextModel;
  safetyTolerance?: number;
  callBackUrl?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface FluxKontextRecordInfoData {
  taskId?: string;
  successFlag?: number;
  originImageUrl?: string;
  resultImageUrl?: string;
}

export type FluxKontextRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: FluxKontextRecordInfoData;
};

export type FluxKontextGenerateResponse = {
  code: number;
  msg?: string;
  data?: { taskId?: string };
};

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface FluxKontextGenerateMethod {
  (req: FluxKontextGenerateRequest): Promise<FluxKontextGenerateResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface FluxKontextNamespace {
  generate: FluxKontextGenerateMethod;
  "record-info"(taskId: string): Promise<FluxKontextRecordInfoResponse>;
}

interface FluxV1Namespace {
  flux: { kontext: FluxKontextNamespace };
}

interface FluxApiNamespace {
  v1: FluxV1Namespace;
}

export interface FluxProvider {
  api: FluxApiNamespace;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createFluxProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): FluxProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  async function generate(
    req: FluxKontextGenerateRequest
  ): Promise<FluxKontextGenerateResponse> {
    return kieRequest<FluxKontextGenerateResponse>(
      `${baseURL}/api/v1/flux/kontext/generate`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  async function recordInfo(
    taskId: string
  ): Promise<FluxKontextRecordInfoResponse> {
    return kieRequest<FluxKontextRecordInfoResponse>(
      `${baseURL}/api/v1/flux/kontext/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  return {
    api: {
      v1: {
        flux: {
          kontext: {
            generate: Object.assign(generate, {
              payloadSchema: fluxKontextGenerateSchema,
              validatePayload(data: unknown): ValidationResult {
                return validatePayload(data, fluxKontextGenerateSchema);
              },
            }),
            "record-info": recordInfo,
          },
        },
      },
    },
  };
}
