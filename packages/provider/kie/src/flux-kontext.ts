import { kieRequest } from "./request";
import type { KieApiEnvelope, PayloadSchema, ValidationResult } from "./types";
import { fluxKontextGenerateSchema } from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export type FluxKontextModel = "flux-kontext-pro" | "flux-kontext-max";

export interface FluxKontextGenerateRequest {
  prompt: string;
  inputImage?: string;
  model?: FluxKontextModel;
  aspectRatio?: "21:9" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16";
  outputFormat?: "jpeg" | "png";
  promptUpsampling?: boolean;
  safetyTolerance?: number;
  watermark?: string;
  enableTranslation?: boolean;
  uploadCn?: boolean;
  callBackUrl?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface FluxKontextRecordInfoData {
  taskId?: string;
  paramJson?: string;
  completeTime?: string;
  createTime?: string;
  successFlag?: number;
  errorCode?: number;
  errorMessage?: string;
  response?: {
    originImageUrl?: string;
    resultImageUrl?: string;
  };
}

export type FluxKontextRecordInfo = KieApiEnvelope<FluxKontextRecordInfoData>;

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface FluxKontextSubmitResponse {
  code: number;
  msg?: string;
  data?: { taskId?: string };
}

interface FluxKontextGenerateMethod {
  (req: FluxKontextGenerateRequest): Promise<FluxKontextSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface FluxKontextNamespace {
  generate: FluxKontextGenerateMethod;
  "record-info"(taskId: string): Promise<FluxKontextRecordInfo>;
}

interface FluxKontextFluxNamespace {
  kontext: FluxKontextNamespace;
}

interface FluxKontextV1Namespace {
  flux: FluxKontextFluxNamespace;
}

interface FluxKontextApiNamespace {
  v1: FluxKontextV1Namespace;
}

export interface FluxKontextProvider {
  api: FluxKontextApiNamespace;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createFluxKontextProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): FluxKontextProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  async function generate(
    req: FluxKontextGenerateRequest
  ): Promise<FluxKontextSubmitResponse> {
    return kieRequest<FluxKontextSubmitResponse>(
      `${baseURL}/api/v1/flux/kontext/generate`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  async function recordInfo(taskId: string): Promise<FluxKontextRecordInfo> {
    return kieRequest<FluxKontextRecordInfo>(
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
