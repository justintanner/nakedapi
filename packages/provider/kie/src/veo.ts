import { kieRequest } from "./request";

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

interface VeoVeoNamespace {
  generate(req: VeoGenerateRequest): Promise<VeoSubmitResponse>;
  extend(req: VeoExtendRequest): Promise<VeoSubmitResponse>;
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

  return {
    api: {
      v1: {
        veo: {
          generate: submitGenerate,
          extend: submitExtend,
        },
      },
    },
  };
}
