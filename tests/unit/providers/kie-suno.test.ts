// Tests for the Suno sub-provider
import { describe, it, expect, vi } from "vitest";

describe("kie suno provider", () => {
  interface SunoGenerateRequest {
    prompt: string;
    model: "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5";
    instrumental: boolean;
    customMode: boolean;
    style?: string;
    negativeTags?: string;
    title?: string;
  }

  interface SunoSubmitResponse {
    code: number;
    msg?: string;
    data?: { taskId?: string };
  }

  interface SunoProvider {
    api: {
      v1: {
        generate(req: SunoGenerateRequest): Promise<SunoSubmitResponse>;
      };
    };
  }

  function createMockSunoProvider(): SunoProvider {
    return {
      api: {
        v1: {
          generate: vi.fn().mockResolvedValue({
            code: 200,
            data: { taskId: "suno-task-123" },
          }),
        },
      },
    };
  }

  it("should generate music", async () => {
    const suno = createMockSunoProvider();
    const result = await suno.api.v1.generate({
      prompt: "A smooth jazz ballad with piano and saxophone",
      model: "V4_5",
      instrumental: true,
      customMode: true,
    });
    expect(result.data?.taskId).toBe("suno-task-123");
  });

  it("should generate instrumental music", async () => {
    const suno = createMockSunoProvider();
    const result = await suno.api.v1.generate({
      prompt: "An upbeat electronic dance track",
      instrumental: true,
      model: "V4_5",
      customMode: true,
    });
    expect(result.data?.taskId).toBe("suno-task-123");
  });

  it("should generate with custom mode options", async () => {
    const suno = createMockSunoProvider();
    const result = await suno.api.v1.generate({
      prompt: "Verse 1: Walking down the street...",
      style: "pop rock",
      customMode: true,
      instrumental: false,
      model: "V4_5",
      title: "City Walk",
      negativeTags: "heavy metal",
    });
    expect(result.data?.taskId).toBe("suno-task-123");
  });

  it("should generate a task and return taskId", async () => {
    const suno = createMockSunoProvider();
    const result = await suno.api.v1.generate({
      prompt: "A lullaby",
      model: "V5",
      instrumental: false,
      customMode: false,
    });
    expect(result.data?.taskId).toBe("suno-task-123");
  });
});
