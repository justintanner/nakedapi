import { kieRequest } from "./request";
import type { KieApiEnvelope, PayloadSchema, ValidationResult } from "./types";
import { runwayGenerateSchema, runwayExtendSchema } from "./schemas";
import { validatePayload } from "./validate";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export interface RunwayGenerateRequest {
  prompt: string;
  imageUrl?: string;
  duration: 5 | 10;
  quality: "720p" | "1080p";
  aspectRatio?: "16:9" | "4:3" | "1:1" | "3:4" | "9:16";
  waterMark?: string;
  callBackUrl?: string;
}

export interface RunwayExtendRequest {
  taskId: string;
  prompt: string;
  quality: "720p" | "1080p";
  waterMark?: string;
  callBackUrl?: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface RunwayVideoInfo {
  videoId?: string;
  taskId?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface RunwayRecordDetailData {
  taskId?: string;
  parentTaskId?: string;
  state?: "wait" | "queueing" | "generating" | "success" | "fail";
  generateTime?: string;
  expireFlag?: number;
  generateParam?: {
    prompt?: string;
    imageUrl?: string;
    expandPrompt?: string;
  };
  videoInfo?: RunwayVideoInfo;
  failCode?: string;
  failMsg?: string;
}

export type RunwayRecordDetail = KieApiEnvelope<RunwayRecordDetailData>;

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface RunwaySubmitResponse {
  code: number;
  msg?: string;
  data?: { taskId?: string };
}

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

interface RunwayRunwayNamespace {
  generate: RunwayGenerateMethod;
  extend: RunwayExtendMethod;
  "record-detail"(taskId: string): Promise<RunwayRecordDetail>;
}

interface RunwayV1Namespace {
  runway: RunwayRunwayNamespace;
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

  async function extend(
    req: RunwayExtendRequest
  ): Promise<RunwaySubmitResponse> {
    return kieRequest<RunwaySubmitResponse>(`${baseURL}/api/v1/runway/extend`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  async function recordDetail(taskId: string): Promise<RunwayRecordDetail> {
    return kieRequest<RunwayRecordDetail>(
      `${baseURL}/api/v1/runway/record-detail?taskId=${encodeURIComponent(taskId)}`,
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
          extend: Object.assign(extend, {
            payloadSchema: runwayExtendSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, runwayExtendSchema);
            },
          }),
          "record-detail": recordDetail,
        },
      },
    },
  };
}
