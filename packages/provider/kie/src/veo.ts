import { kieRequest } from "./request";
import type { PayloadSchema, ValidationResult } from "./types";
import {
  veoGenerateSchema,
  veoExtendSchema,
  veoGet4kVideoSchema,
} from "./schemas";
import { validatePayload } from "./validate";

export type VeoModel = "veo3" | "veo3_fast";

export type VeoGenerationType =
  | "TEXT_2_VIDEO"
  | "REFERENCE_2_VIDEO"
  | "FIRST_AND_LAST_FRAMES_2_VIDEO";

export interface VeoGenerateRequest {
  prompt: string;
  model?: VeoModel;
  aspectRatio?: "16:9" | "9:16" | "Auto";
  generationType?: VeoGenerationType;
  imageUrls?: string[];
  seeds?: number;
  watermark?: string;
  enableTranslation?: boolean;
}

export interface VeoExtendRequest {
  taskId: string;
  prompt: string;
  model?: "fast" | "quality";
  seeds?: number;
  watermark?: string;
}

export interface VeoGet4kVideoRequest {
  taskId: string;
  index?: number;
  callBackUrl?: string;
}

interface VeoSubmitResponse {
  code: number;
  data?: {
    taskId?: string;
  };
}

export interface VeoRecordInfoData {
  taskId?: string;
  successFlag?: number;
  resultUrls?: string[];
  resolution?: string;
  progress?: number;
  failMsg?: string;
}

export type VeoRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: VeoRecordInfoData;
};

export type Veo1080pResponse = {
  code: number;
  msg?: string;
  data?: { url?: string };
};

export type Veo4kResponse = {
  code: number;
  msg?: string;
  data?: { taskId?: string };
};

interface VeoGenerateMethod {
  (req: VeoGenerateRequest): Promise<VeoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface VeoExtendMethod {
  (req: VeoExtendRequest): Promise<VeoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface VeoGet4kMethod {
  (req: VeoGet4kVideoRequest): Promise<Veo4kResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface VeoVeoNamespace {
  generate: VeoGenerateMethod;
  extend: VeoExtendMethod;
  "record-info"(taskId: string): Promise<VeoRecordInfoResponse>;
  "get-1080p-video"(taskId: string): Promise<Veo1080pResponse>;
  "get-4k-video": VeoGet4kMethod;
}

interface VeoV1Namespace {
  veo: VeoVeoNamespace;
}

interface VeoApiNamespace {
  v1: VeoV1Namespace;
}

export interface VeoProvider {
  api: VeoApiNamespace;
}

export function createVeoProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): VeoProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  async function submitGenerate(
    req: VeoGenerateRequest
  ): Promise<VeoSubmitResponse> {
    return kieRequest<VeoSubmitResponse>(`${baseURL}/api/v1/veo/generate`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  async function submitExtend(
    req: VeoExtendRequest
  ): Promise<VeoSubmitResponse> {
    return kieRequest<VeoSubmitResponse>(`${baseURL}/api/v1/veo/extend`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  async function recordInfo(taskId: string): Promise<VeoRecordInfoResponse> {
    return kieRequest<VeoRecordInfoResponse>(
      `${baseURL}/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  async function get1080pVideo(taskId: string): Promise<Veo1080pResponse> {
    return kieRequest<Veo1080pResponse>(
      `${baseURL}/api/v1/veo/get-1080p-video?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  async function get4kVideo(req: VeoGet4kVideoRequest): Promise<Veo4kResponse> {
    return kieRequest<Veo4kResponse>(`${baseURL}/api/v1/veo/get-4k-video`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  return {
    api: {
      v1: {
        veo: {
          generate: Object.assign(submitGenerate, {
            payloadSchema: veoGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, veoGenerateSchema);
            },
          }),
          extend: Object.assign(submitExtend, {
            payloadSchema: veoExtendSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, veoExtendSchema);
            },
          }),
          "record-info": recordInfo,
          "get-1080p-video": get1080pVideo,
          "get-4k-video": Object.assign(get4kVideo, {
            payloadSchema: veoGet4kVideoSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, veoGet4kVideoSchema);
            },
          }),
        },
      },
    },
  };
}
