import { KieError, TaskResult, TaskStatusDetails, WaitOptions } from "./types";
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

export interface VeoProvider {
  generate(req: VeoGenerateRequest, options?: WaitOptions): Promise<TaskResult>;
  extend(req: VeoExtendRequest, options?: WaitOptions): Promise<TaskResult>;
  createTask(req: VeoGenerateRequest): Promise<{ taskId: string }>;
  getTaskStatus(taskId: string): Promise<TaskStatusDetails>;
  waitForTask(taskId: string, options?: WaitOptions): Promise<TaskResult>;
}

interface VeoSubmitResponse {
  code: number;
  data?: {
    taskId?: string;
  };
}

interface VeoStatusResponse {
  success: boolean;
  data?: {
    successFlag: number | null;
    response?: {
      resultUrls?: string[];
    };
    errorMessage?: string | null;
    errorCode?: string | null;
  };
}

function parseVeoStatus(
  taskId: string,
  response: VeoStatusResponse
): TaskStatusDetails {
  const data = response.data;
  if (!data) {
    throw new KieError("No data in Veo status response", 500);
  }

  const flag = data.successFlag;

  if (flag === 1) {
    const urls = data.response?.resultUrls ?? [];
    return {
      taskId,
      status: "completed",
      state: "success",
      result: { urls, resultUrls: urls },
    };
  }

  if (flag === 0) {
    return {
      taskId,
      status: "processing",
      state: "generating",
    };
  }

  // null or other = failed
  const errorMsg = data.errorMessage || data.errorCode || "Veo task failed";
  return {
    taskId,
    status: "failed",
    state: "fail",
    error: String(errorMsg),
    failMsg: String(errorMsg),
  };
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
  ): Promise<{ taskId: string }> {
    const body: Record<string, unknown> = { prompt: req.prompt };
    if (req.model) body.model = req.model;
    if (req.aspectRatio) body.aspectRatio = req.aspectRatio;
    if (req.generationType) body.generationType = req.generationType;
    if (req.imageUrls) body.imageUrls = req.imageUrls;
    if (req.seeds !== undefined) body.seeds = req.seeds;
    if (req.watermark) body.watermark = req.watermark;
    if (req.enableTranslation !== undefined)
      body.enableTranslation = req.enableTranslation;

    const res = await kieRequest<VeoSubmitResponse>(
      `${baseURL}/api/v1/veo/generate`,
      { method: "POST", body, ...requestOpts }
    );

    if (!res.data?.taskId) {
      throw new KieError("No taskId in Veo generate response", 500);
    }

    return { taskId: res.data.taskId };
  }

  async function submitExtend(
    req: VeoExtendRequest
  ): Promise<{ taskId: string }> {
    const body: Record<string, unknown> = {
      taskId: req.taskId,
      prompt: req.prompt,
    };
    if (req.model) body.model = req.model;
    if (req.seeds !== undefined) body.seeds = req.seeds;
    if (req.watermark) body.watermark = req.watermark;

    const res = await kieRequest<VeoSubmitResponse>(
      `${baseURL}/api/v1/veo/extend`,
      { method: "POST", body, ...requestOpts }
    );

    if (!res.data?.taskId) {
      throw new KieError("No taskId in Veo extend response", 500);
    }

    return { taskId: res.data.taskId };
  }

  async function getTaskStatus(taskId: string): Promise<TaskStatusDetails> {
    const res = await kieRequest<VeoStatusResponse>(
      `${baseURL}/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );

    return parseVeoStatus(taskId, res);
  }

  async function waitForTask(
    taskId: string,
    options: WaitOptions = {}
  ): Promise<TaskResult> {
    const {
      intervalMs = 3000,
      maxAttempts = 300,
      timeoutMs = 900000,
      onProgress,
    } = options;

    const startTime = Date.now();
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (Date.now() - startTime > timeoutMs) {
        throw new KieError(
          `Veo task polling timeout after ${timeoutMs}ms`,
          408
        );
      }

      const status = await getTaskStatus(taskId);
      attempts++;

      if (onProgress) onProgress(status);

      if (status.status === "completed") {
        const urls = status.result?.resultUrls ?? status.result?.urls ?? [];
        return {
          taskId,
          status: "completed",
          urls,
          videoUrl: urls[0],
        };
      }

      if (status.status === "failed") {
        return {
          taskId,
          status: "failed",
          urls: [],
          error: status.failMsg ?? status.error ?? "Veo task failed",
        };
      }

      const delay = Math.min(intervalMs * Math.pow(1.1, attempts), 30000);
      await new Promise((resolve) => setTimeout(resolve, Math.floor(delay)));
    }

    throw new KieError(
      `Veo task polling exceeded max attempts (${maxAttempts})`,
      408
    );
  }

  return {
    async generate(
      req: VeoGenerateRequest,
      options?: WaitOptions
    ): Promise<TaskResult> {
      const { taskId } = await submitGenerate(req);
      return waitForTask(taskId, options);
    },

    async extend(
      req: VeoExtendRequest,
      options?: WaitOptions
    ): Promise<TaskResult> {
      const { taskId } = await submitExtend(req);
      return waitForTask(taskId, options);
    },

    createTask: submitGenerate,
    getTaskStatus,
    waitForTask,
  };
}
