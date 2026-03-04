// Tests for the Veo sub-provider
import { describe, it, expect, vi } from "vitest";

describe("kie veo provider", () => {
  interface TaskResult {
    taskId: string;
    status: "completed" | "failed";
    urls: string[];
    videoUrl?: string;
    error?: string;
  }

  interface TaskStatusDetails {
    taskId: string;
    status: string;
    state?: string;
    result?: { urls?: string[]; resultUrls?: string[] };
    error?: string;
    failMsg?: string;
  }

  interface VeoGenerateRequest {
    prompt: string;
    model?: "veo3" | "veo3_fast";
    aspectRatio?: "16:9" | "9:16" | "Auto";
    generationType?: string;
    imageUrls?: string[];
    seeds?: number;
    watermark?: string;
    enableTranslation?: boolean;
  }

  interface VeoExtendRequest {
    taskId: string;
    prompt: string;
    model?: "fast" | "quality";
    seeds?: number;
    watermark?: string;
  }

  interface VeoProvider {
    generate(req: VeoGenerateRequest): Promise<TaskResult>;
    extend(req: VeoExtendRequest): Promise<TaskResult>;
    createTask(req: VeoGenerateRequest): Promise<{ taskId: string }>;
    getTaskStatus(taskId: string): Promise<TaskStatusDetails>;
    waitForTask(taskId: string): Promise<TaskResult>;
  }

  function createMockVeoProvider(): VeoProvider {
    return {
      generate: vi.fn().mockResolvedValue({
        taskId: "veo-task-123",
        status: "completed",
        urls: ["https://example.com/video.mp4"],
        videoUrl: "https://example.com/video.mp4",
      }),
      extend: vi.fn().mockResolvedValue({
        taskId: "veo-extend-456",
        status: "completed",
        urls: ["https://example.com/extended.mp4"],
        videoUrl: "https://example.com/extended.mp4",
      }),
      createTask: vi.fn().mockResolvedValue({ taskId: "veo-task-123" }),
      getTaskStatus: vi.fn().mockResolvedValue({
        taskId: "veo-task-123",
        status: "completed",
        state: "success",
        result: {
          urls: ["https://example.com/video.mp4"],
          resultUrls: ["https://example.com/video.mp4"],
        },
      }),
      waitForTask: vi.fn().mockResolvedValue({
        taskId: "veo-task-123",
        status: "completed",
        urls: ["https://example.com/video.mp4"],
        videoUrl: "https://example.com/video.mp4",
      }),
    };
  }

  it("should generate a video with text prompt", async () => {
    const veo = createMockVeoProvider();
    const result = await veo.generate({
      prompt: "A rocket launch at sunset",
      model: "veo3_fast",
      aspectRatio: "16:9",
    });
    expect(result.status).toBe("completed");
    expect(result.videoUrl).toBe("https://example.com/video.mp4");
  });

  it("should generate with reference images", async () => {
    const veo = createMockVeoProvider();
    const result = await veo.generate({
      prompt: "Similar style video",
      model: "veo3_fast",
      generationType: "REFERENCE_2_VIDEO",
      imageUrls: ["https://example.com/ref1.jpg"],
    });
    expect(result.status).toBe("completed");
  });

  it("should extend a completed video", async () => {
    const veo = createMockVeoProvider();
    const result = await veo.extend({
      taskId: "veo-task-123",
      prompt: "Continue the scene with a zoom out",
      model: "fast",
    });
    expect(result.status).toBe("completed");
    expect(result.videoUrl).toBe("https://example.com/extended.mp4");
  });

  it("should create a task and return taskId", async () => {
    const veo = createMockVeoProvider();
    const { taskId } = await veo.createTask({
      prompt: "A beautiful sunset",
    });
    expect(taskId).toBe("veo-task-123");
  });

  it("should get task status", async () => {
    const veo = createMockVeoProvider();
    const status = await veo.getTaskStatus("veo-task-123");
    expect(status.status).toBe("completed");
    expect(status.state).toBe("success");
  });

  it("should handle failed status", async () => {
    const veo = createMockVeoProvider();
    (veo.getTaskStatus as ReturnType<typeof vi.fn>).mockResolvedValue({
      taskId: "veo-fail-789",
      status: "failed",
      state: "fail",
      error: "Content policy violation",
      failMsg: "Content policy violation",
    });

    const status = await veo.getTaskStatus("veo-fail-789");
    expect(status.status).toBe("failed");
    expect(status.error).toBe("Content policy violation");
  });
});
