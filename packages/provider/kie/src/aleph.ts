import { kieRequest } from "./request";
import type { KieApiEnvelope, PayloadSchema, ValidationResult } from "./types";
import { alephGenerateSchema } from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export interface AlephGenerateRequest {
  prompt: string;
  videoUrl: string;
  referenceImage?: string;
  aspectRatio?:
    | "16:9"
    | "9:16"
    | "4:3"
    | "3:4"
    | "1:1"
    | "21:9";
  seed?: number;
  waterMark?: string;
  uploadCn?: boolean;
  callBackUrl?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface AlephRecordInfoData {
  taskId?: string;
  paramJson?: string;
  completeTime?: string;
  createTime?: string;
  successFlag?: number;
  errorCode?: number;
  errorMessage?: string;
  response?: {
    taskId?: string;
    resultVideoUrl?: string;
    resultImageUrl?: string;
  };
}

export type AlephRecordInfo = KieApiEnvelope<AlephRecordInfoData>;

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface AlephSubmitResponse {
  code: number;
  msg?: string;
  data?: { taskId?: string };
}

interface AlephGenerateMethod {
  (req: AlephGenerateRequest): Promise<AlephSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface AlephAlephNamespace {
  generate: AlephGenerateMethod;
  "record-info"(taskId: string): Promise<AlephRecordInfo>;
}

interface AlephV1Namespace {
  aleph: AlephAlephNamespace;
}

interface AlephApiNamespace {
  v1: AlephV1Namespace;
}

export interface AlephProvider {
  api: AlephApiNamespace;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createAlephProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): AlephProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  async function generate(
    req: AlephGenerateRequest
  ): Promise<AlephSubmitResponse> {
    return kieRequest<AlephSubmitResponse>(
      `${baseURL}/api/v1/aleph/generate`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  async function recordInfo(
    taskId: string
  ): Promise<AlephRecordInfo> {
    return kieRequest<AlephRecordInfo>(
      `${baseURL}/api/v1/aleph/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  return {
    api: {
      v1: {
        aleph: {
          generate: Object.assign(generate, {
            payloadSchema: alephGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, alephGenerateSchema);
            },
          }),
          "record-info": recordInfo,
        },
      },
    },
  };
}
