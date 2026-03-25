import { kieRequest } from "./request";

export type SunoModel = "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5";

export interface SunoGenerateRequest {
  prompt: string;
  model: SunoModel;
  instrumental: boolean;
  customMode: boolean;
  style?: string;
  negativeTags?: string;
  title?: string;
}

interface SunoSubmitResponse {
  code: number;
  msg?: string;
  data?: {
    taskId?: string;
  };
}

interface SunoV1Namespace {
  generate(req: SunoGenerateRequest): Promise<SunoSubmitResponse>;
}

interface SunoApiNamespace {
  v1: SunoV1Namespace;
}

export interface SunoProvider {
  api: SunoApiNamespace;
}

export function createSunoProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): SunoProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  async function createTask(
    req: SunoGenerateRequest
  ): Promise<SunoSubmitResponse> {
    return kieRequest<SunoSubmitResponse>(`${baseURL}/api/v1/generate`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  return {
    api: {
      v1: {
        generate: createTask,
      },
    },
  };
}
