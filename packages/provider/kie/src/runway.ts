import { kieRequest } from "./request";
import type { PayloadSchema, ValidationResult } from "./types";
import {
  runwayGenerateSchema,
  runwayExtendSchema,
  alephGenerateSchema,
} from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export interface RunwayGenerateRequest {
  prompt: string;
  duration?: 5 | 10;
  quality?: "720p" | "1080p";
  aspectRatio?: string;
  imageUrl?: string;
  waterMark?: string;
  callBackUrl?: string;
}

export interface RunwayExtendRequest {
  taskId: string;
  prompt: string;
  quality?: "720p" | "1080p";
  waterMark?: string;
  callBackUrl?: string;
}

export interface AlephGenerateRequest {
  prompt: string;
  videoUrl: string;
  callBackUrl?: string;
  aspectRatio?: string;
  seed?: number;
  referenceImage?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface RunwayRecordDetailVideoInfo {
  url?: string;
  previewUrl?: string;
}

export interface RunwayRecordDetailData {
  taskId?: string;
  state?: string;
  videoInfo?: RunwayRecordDetailVideoInfo;
  failMsg?: string;
}

export type RunwayRecordDetailResponse = {
  code: number;
  msg?: string;
  data?: RunwayRecordDetailData;
};

export type RunwaySubmitResponse = {
  code: number;
  msg?: string;
  data?: { taskId?: string };
};

export interface AlephRecordInfoData {
  taskId?: string;
  status?: string;
  resultVideoUrl?: string;
  resultImageUrl?: string;
}

export type AlephRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: AlephRecordInfoData;
};

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface RunwayGenerateMethod {
  (req: RunwayGenerateRequest): Promise<RunwaySubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface RunwayExtendMethod {
  (req: RunwayExtendRequest): Promise<RunwaySubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface AlephGenerateMethod {
  (req: AlephGenerateRequest): Promise<RunwaySubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface RunwayNamespace {
  generate: RunwayGenerateMethod;
  "record-detail"(taskId: string): Promise<RunwayRecordDetailResponse>;
  extend: RunwayExtendMethod;
}

interface AlephNamespace {
  generate: AlephGenerateMethod;
  "record-info"(taskId: string): Promise<AlephRecordInfoResponse>;
}

interface RunwayV1Namespace {
  runway: RunwayNamespace;
  aleph: AlephNamespace;
}

interface RunwayApiNamespace {
  v1: RunwayV1Namespace;
}

export interface RunwayProvider {
  api: RunwayApiNamespace;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createRunwayProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): RunwayProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  async function generate(
    req: RunwayGenerateRequest
  ): Promise<RunwaySubmitResponse> {
    return kieRequest<RunwaySubmitResponse>(
      `${baseURL}/api/v1/runway/generate`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  async function recordDetail(
    taskId: string
  ): Promise<RunwayRecordDetailResponse> {
    return kieRequest<RunwayRecordDetailResponse>(
      `${baseURL}/api/v1/runway/record-detail?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  async function extend(
    req: RunwayExtendRequest
  ): Promise<RunwaySubmitResponse> {
    return kieRequest<RunwaySubmitResponse>(`${baseURL}/api/v1/runway/extend`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  async function alephGenerate(
    req: AlephGenerateRequest
  ): Promise<RunwaySubmitResponse> {
    return kieRequest<RunwaySubmitResponse>(
      `${baseURL}/api/v1/aleph/generate`,
      { method: "POST", body: req, ...requestOpts }
    );
  }

  async function alephRecordInfo(
    taskId: string
  ): Promise<AlephRecordInfoResponse> {
    return kieRequest<AlephRecordInfoResponse>(
      `${baseURL}/api/v1/aleph/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  return {
    api: {
      v1: {
        runway: {
          generate: Object.assign(generate, {
            payloadSchema: runwayGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, runwayGenerateSchema);
            },
          }),
          "record-detail": recordDetail,
          extend: Object.assign(extend, {
            payloadSchema: runwayExtendSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, runwayExtendSchema);
            },
          }),
        },
        aleph: {
          generate: Object.assign(alephGenerate, {
            payloadSchema: alephGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, alephGenerateSchema);
            },
          }),
          "record-info": alephRecordInfo,
        },
      },
    },
  };
}
