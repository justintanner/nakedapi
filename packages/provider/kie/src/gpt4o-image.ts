import { kieRequest } from "./request";
import type { KieApiEnvelope, PayloadSchema, ValidationResult } from "./types";
import {
  gpt4oImageGenerateSchema,
  gpt4oImageDownloadUrlSchema,
} from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export type Gpt4oImageFallbackModel = "GPT_IMAGE_1" | "FLUX_MAX";

export interface Gpt4oImageGenerateRequest {
  prompt?: string;
  filesUrl?: string[];
  size: "1:1" | "3:2" | "2:3";
  maskUrl?: string;
  nVariants?: 1 | 2 | 4;
  isEnhance?: boolean;
  enableFallback?: boolean;
  fallbackModel?: Gpt4oImageFallbackModel;
  uploadCn?: boolean;
  callBackUrl?: string;
}

export interface Gpt4oImageDownloadUrlRequest {
  taskId: string;
  url: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface Gpt4oImageRecordInfoData {
  taskId?: string;
  paramJson?: string;
  createTime?: number;
  completeTime?: number;
  progress?: string;
  status?: "GENERATING" | "SUCCESS" | "CREATE_TASK_FAILED" | "GENERATE_FAILED";
  successFlag?: number;
  response?: {
    resultUrls?: string[];
  };
  errorCode?: string;
  errorMessage?: string;
}

export type Gpt4oImageRecordInfo = KieApiEnvelope<Gpt4oImageRecordInfoData>;
export type Gpt4oImageDownloadUrl = KieApiEnvelope<string>;

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface Gpt4oImageSubmitResponse {
  code: number;
  msg?: string;
  data?: { taskId?: string };
}

interface Gpt4oImageGenerateMethod {
  (req: Gpt4oImageGenerateRequest): Promise<Gpt4oImageSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface Gpt4oImageDownloadUrlMethod {
  (req: Gpt4oImageDownloadUrlRequest): Promise<Gpt4oImageDownloadUrl>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface Gpt4oImageNamespace {
  generate: Gpt4oImageGenerateMethod;
  "record-info"(taskId: string): Promise<Gpt4oImageRecordInfo>;
  "download-url": Gpt4oImageDownloadUrlMethod;
}

interface Gpt4oImageV1Namespace {
  "gpt4o-image": Gpt4oImageNamespace;
}

interface Gpt4oImageApiNamespace {
  v1: Gpt4oImageV1Namespace;
}

export interface Gpt4oImageProvider {
  api: Gpt4oImageApiNamespace;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createGpt4oImageProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): Gpt4oImageProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  async function generate(
    req: Gpt4oImageGenerateRequest
  ): Promise<Gpt4oImageSubmitResponse> {
    return kieRequest<Gpt4oImageSubmitResponse>(
      `${baseURL}/api/v1/gpt4o-image/generate`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  async function recordInfo(taskId: string): Promise<Gpt4oImageRecordInfo> {
    return kieRequest<Gpt4oImageRecordInfo>(
      `${baseURL}/api/v1/gpt4o-image/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  async function downloadUrl(
    req: Gpt4oImageDownloadUrlRequest
  ): Promise<Gpt4oImageDownloadUrl> {
    return kieRequest<Gpt4oImageDownloadUrl>(
      `${baseURL}/api/v1/gpt4o-image/download-url`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  return {
    api: {
      v1: {
        "gpt4o-image": {
          generate: Object.assign(generate, {
            payloadSchema: gpt4oImageGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, gpt4oImageGenerateSchema);
            },
          }),
          "record-info": recordInfo,
          "download-url": Object.assign(downloadUrl, {
            payloadSchema: gpt4oImageDownloadUrlSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, gpt4oImageDownloadUrlSchema);
            },
          }),
        },
      },
    },
  };
}
