// Tests for the Suno sub-provider
import { describe, it, expect, vi } from "vitest";

describe("kie suno provider", () => {
  interface SunoResult {
    taskId: string;
    status: "completed" | "failed";
    urls: string[];
    title?: string;
    duration?: number;
    trackCount?: number;
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

  interface SunoGenerateRequest {
    prompt: string;
    style?: string;
    instrumental?: boolean;
    model?: "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5";
    customMode?: boolean;
    negativeTags?: string;
    title?: string;
  }

  interface SunoProvider {
    generate(req: SunoGenerateRequest): Promise<SunoResult>;
    createTask(req: SunoGenerateRequest): Promise<{ taskId: string }>;
    getTaskStatus(taskId: string): Promise<TaskStatusDetails>;
    waitForTask(taskId: string): Promise<SunoResult>;
  }

  function createMockSunoProvider(): SunoProvider {
    return {
      generate: vi.fn().mockResolvedValue({
        taskId: "suno-task-123",
        status: "completed",
        urls: ["https://example.com/track.mp3"],
        title: "Sunset Jazz",
        duration: 180,
        trackCount: 2,
      }),
      createTask: vi.fn().mockResolvedValue({ taskId: "suno-task-123" }),
      getTaskStatus: vi.fn().mockResolvedValue({
        taskId: "suno-task-123",
        status: "completed",
        state: "success",
        result: {
          urls: ["https://example.com/track.mp3"],
          resultUrls: ["https://example.com/track.mp3"],
        },
      }),
      waitForTask: vi.fn().mockResolvedValue({
        taskId: "suno-task-123",
        status: "completed",
        urls: ["https://example.com/track.mp3"],
        title: "Sunset Jazz",
        duration: 180,
        trackCount: 2,
      }),
    };
  }

  it("should generate music with default model", async () => {
    const suno = createMockSunoProvider();
    const result = await suno.generate({
      prompt: "A smooth jazz ballad with piano and saxophone",
    });
    expect(result.status).toBe("completed");
    expect(result.title).toBe("Sunset Jazz");
    expect(result.duration).toBe(180);
    expect(result.trackCount).toBe(2);
  });

  it("should generate instrumental music", async () => {
    const suno = createMockSunoProvider();
    const result = await suno.generate({
      prompt: "An upbeat electronic dance track",
      instrumental: true,
      model: "V4_5",
    });
    expect(result.status).toBe("completed");
  });

  it("should generate with custom mode options", async () => {
    const suno = createMockSunoProvider();
    const result = await suno.generate({
      prompt: "Verse 1: Walking down the street...",
      style: "pop rock",
      customMode: true,
      title: "City Walk",
      negativeTags: "heavy metal",
    });
    expect(result.status).toBe("completed");
  });

  it("should create a task and return taskId", async () => {
    const suno = createMockSunoProvider();
    const { taskId } = await suno.createTask({
      prompt: "A lullaby",
      model: "V5",
    });
    expect(taskId).toBe("suno-task-123");
  });

  it("should get task status", async () => {
    const suno = createMockSunoProvider();
    const status = await suno.getTaskStatus("suno-task-123");
    expect(status.status).toBe("completed");
  });

  it("should handle failed generation", async () => {
    const suno = createMockSunoProvider();
    (suno.generate as ReturnType<typeof vi.fn>).mockResolvedValue({
      taskId: "suno-fail-456",
      status: "failed",
      urls: [],
      error: "Content policy violation",
    });

    const result = await suno.generate({
      prompt: "Something inappropriate",
    });
    expect(result.status).toBe("failed");
    expect(result.error).toBe("Content policy violation");
  });
});
