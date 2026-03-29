import { kieRequest } from "./request";
import type {
  PayloadSchema,
  ValidationResult,
  KieTaskInfo,
} from "./types";
import { veoGenerateSchema, veoExtendSchema } from "./schemas";
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

interface VeoSubmitResponse {
  code: number;
  data?: {
    taskId?: string;
  };
}

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

interface VeoVeoNamespace {
  generate: VeoGenerateMethod;
  extend: VeoExtendMethod;
  "record-info"(taskId: string): Promise<KieTaskInfo>;
  "get-1080p"(taskId: string): Promise<VeoSubmitResponse>;
  "get-4k"(taskId: string): Promise<VeoSubmitResponse>;
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

  async function recordInfo(taskId: string): Promise<KieTaskInfo> {
    return kieRequest<KieTaskInfo>(
      `${baseURL}/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  async function get1080p(taskId: string): Promise<VeoSubmitResponse> {
    return kieRequest<VeoSubmitResponse>(
      `${baseURL}/api/v1/veo/get-1080p?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
  }

  async function get4k(taskId: string): Promise<VeoSubmitResponse> {
    return kieRequest<VeoSubmitResponse>(
      `${baseURL}/api/v1/veo/get-4k?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );
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
          "get-1080p": get1080p,
          "get-4k": get4k,
        },
      },
    },
  };
}
