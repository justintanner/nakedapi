import { KieError, TaskStatusDetails, TaskResult, WaitOptions } from "./types";
import { kieRequest } from "./request";

export type SunoModel = "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5";

export interface SunoGenerateRequest {
  prompt: string;
  style?: string;
  instrumental?: boolean;
  model?: SunoModel;
  customMode?: boolean;
  negativeTags?: string;
  title?: string;
}

export interface SunoResult extends TaskResult {
  title?: string;
  duration?: number;
  trackCount?: number;
}

export interface SunoProvider {
  generate(
    req: SunoGenerateRequest,
    options?: WaitOptions
  ): Promise<SunoResult>;
  createTask(req: SunoGenerateRequest): Promise<{ taskId: string }>;
  getTaskStatus(taskId: string): Promise<TaskStatusDetails>;
  waitForTask(taskId: string, options?: WaitOptions): Promise<SunoResult>;
}

interface SunoSubmitResponse {
  code: number;
  msg?: string;
  data?: {
    taskId?: string;
  };
}

interface SunoTrack {
  audioUrl?: string;
  title?: string;
  duration?: number;
}

interface SunoStatusData {
  status?: string;
  state?: string;
  errorMessage?: string;
  failMsg?: string;
  response?: {
    sunoData?: SunoTrack[];
  };
}

interface SunoStatusResponse {
  code: number;
  data?: SunoStatusData;
}

const SUNO_SUCCESS_STATES = ["success", "SUCCESS", "FIRST_SUCCESS"];
const SUNO_FAIL_STATES = ["fail", "FAIL", "GENERATE_AUDIO_FAILED"];

function parseSunoStatus(
  taskId: string,
  response: SunoStatusResponse
): {
  status: TaskStatusDetails;
  tracks?: SunoTrack[];
} {
  const data = response.data;
  if (!data) {
    throw new KieError("No data in Suno status response", 500);
  }

  const rawState = data.status ?? data.state ?? "";

  if (SUNO_SUCCESS_STATES.includes(rawState)) {
    const tracks = data.response?.sunoData ?? [];
    const urls = tracks.map((t) => t.audioUrl).filter((u): u is string => !!u);

    return {
      status: {
        taskId,
        status: "completed",
        state: "success",
        result: { urls, resultUrls: urls },
      },
      tracks,
    };
  }

  if (SUNO_FAIL_STATES.includes(rawState)) {
    const errorMsg = data.errorMessage ?? data.failMsg ?? "Suno task failed";
    return {
      status: {
        taskId,
        status: "failed",
        state: "fail",
        error: errorMsg,
        failMsg: errorMsg,
      },
    };
  }

  return {
    status: {
      taskId,
      status: "processing",
      state: "generating",
    },
  };
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
  ): Promise<{ taskId: string }> {
    const body: Record<string, unknown> = {
      prompt: req.prompt,
      model: req.model ?? "V4_5",
      instrumental: req.instrumental ?? true,
      customMode: req.customMode ?? true,
    };
    if (req.style !== undefined) body.style = req.style;
    if (req.negativeTags !== undefined) body.negativeTags = req.negativeTags;
    if (req.title !== undefined) body.title = req.title;

    const res = await kieRequest<SunoSubmitResponse>(
      `${baseURL}/api/v1/generate`,
      { method: "POST", body, ...requestOpts }
    );

    if (!res.data?.taskId) {
      throw new KieError("No taskId in Suno generate response", 500);
    }

    return { taskId: res.data.taskId };
  }

  async function getTaskStatus(taskId: string): Promise<TaskStatusDetails> {
    const res = await kieRequest<SunoStatusResponse>(
      `${baseURL}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", ...requestOpts }
    );

    return parseSunoStatus(taskId, res).status;
  }

  async function waitForTask(
    taskId: string,
    options: WaitOptions = {}
  ): Promise<SunoResult> {
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
          `Suno task polling timeout after ${timeoutMs}ms`,
          408
        );
      }

      const res = await kieRequest<SunoStatusResponse>(
        `${baseURL}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
        { method: "GET", ...requestOpts }
      );

      const parsed = parseSunoStatus(taskId, res);
      attempts++;

      if (onProgress) onProgress(parsed.status);

      if (parsed.status.status === "completed") {
        const urls =
          parsed.status.result?.resultUrls ?? parsed.status.result?.urls ?? [];
        const firstTrack = parsed.tracks?.[0];
        return {
          taskId,
          status: "completed",
          urls,
          title: firstTrack?.title,
          duration: firstTrack?.duration,
          trackCount: parsed.tracks?.length,
        };
      }

      if (parsed.status.status === "failed") {
        return {
          taskId,
          status: "failed",
          urls: [],
          error:
            parsed.status.failMsg ?? parsed.status.error ?? "Suno task failed",
        };
      }

      const delay = Math.min(intervalMs * Math.pow(1.1, attempts), 30000);
      await new Promise((resolve) => setTimeout(resolve, Math.floor(delay)));
    }

    throw new KieError(
      `Suno task polling exceeded max attempts (${maxAttempts})`,
      408
    );
  }

  return {
    async generate(
      req: SunoGenerateRequest,
      options?: WaitOptions
    ): Promise<SunoResult> {
      const { taskId } = await createTask(req);
      return waitForTask(taskId, options);
    },
    createTask,
    getTaskStatus,
    waitForTask,
  };
}
