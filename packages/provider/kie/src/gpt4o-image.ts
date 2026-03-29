import { kieRequest } from "./request";
import type { PayloadSchema, ValidationResult } from "./types";
import {
  gpt4oImageGenerateSchema,
  gpt4oImageDownloadUrlSchema,
} from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export interface Gpt4oImageGenerateRequest {
  prompt?: string;
  filesUrl?: string[];
  size?: "1:1" | "3:2" | "2:3";
  maskUrl?: string;
  callBackUrl?: string;
  isEnhance?: boolean;
  enableFallback?: boolean;
  fallbackModel?: string;
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
  status?: string;
  resultUrls?: string[];
  progress?: number;
}

export type Gpt4oImageRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: Gpt4oImageRecordInfoData;
};

export type Gpt4oImageGenerateResponse = {
  code: number;
  msg?: string;
  data?: { taskId?: string };
};

export type Gpt4oImageDownloadUrlResponse = {
  code: number;
  msg?: string;
  data?: string;
};

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface Gpt4oImageGenerateMethod {
  (req: Gpt4oImageGenerateRequest): Promise<Gpt4oImageGenerateResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface Gpt4oImageDownloadUrlMethod {
  (req: Gpt4oImageDownloadUrlRequest): Promise<Gpt4oImageDownloadUrlResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface Gpt4oImageNamespace {
  generate: Gpt4oImageGenerateMethod;
  "record-info"(taskId: string): Promise<Gpt4oImageRecordInfoResponse>;
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
  ): Promise<Gpt4oImageGenerateResponse> {
    return kieRequest<Gpt4oImageGenerateResponse>(
      `${baseURL}/api/v1/gpt4o-image/generate`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  async function recordInfo(
    taskId: string
  ): Promise<Gpt4oImageRecordInfoResponse> {
    return kieRequest<Gpt4oImageRecordInfoResponse>(
      `${baseURL}/api/v1/gpt4o-image/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  async function downloadUrl(
    req: Gpt4oImageDownloadUrlRequest
  ): Promise<Gpt4oImageDownloadUrlResponse> {
    return kieRequest<Gpt4oImageDownloadUrlResponse>(
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
