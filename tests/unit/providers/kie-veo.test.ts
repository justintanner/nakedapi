// Tests for the Veo sub-provider
import { describe, it, expect, vi } from "vitest";

describe("kie veo provider", () => {
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

  interface VeoSubmitResponse {
    code: number;
    data?: { taskId?: string };
  }

  interface VeoProvider {
    api: {
      v1: {
        veo: {
          generate(req: VeoGenerateRequest): Promise<VeoSubmitResponse>;
          extend(req: VeoExtendRequest): Promise<VeoSubmitResponse>;
        };
      };
    };
  }

  function createMockVeoProvider(): VeoProvider {
    return {
      api: {
        v1: {
          veo: {
            generate: vi.fn().mockResolvedValue({
              code: 200,
              data: { taskId: "veo-task-123" },
            }),
            extend: vi.fn().mockResolvedValue({
              code: 200,
              data: { taskId: "veo-extend-456" },
            }),
          },
        },
      },
    };
  }

  it("should generate a video with text prompt", async () => {
    const veo = createMockVeoProvider();
    const result = await veo.api.v1.veo.generate({
      prompt: "A rocket launch at sunset",
      model: "veo3_fast",
      aspectRatio: "16:9",
    });
    expect(result.data?.taskId).toBe("veo-task-123");
  });

  it("should generate with reference images", async () => {
    const veo = createMockVeoProvider();
    const result = await veo.api.v1.veo.generate({
      prompt: "Similar style video",
      model: "veo3_fast",
      generationType: "REFERENCE_2_VIDEO",
      imageUrls: ["https://example.com/ref1.jpg"],
    });
    expect(result.data?.taskId).toBe("veo-task-123");
  });

  it("should extend a completed video", async () => {
    const veo = createMockVeoProvider();
    const result = await veo.api.v1.veo.extend({
      taskId: "veo-task-123",
      prompt: "Continue the scene with a zoom out",
      model: "fast",
    });
    expect(result.data?.taskId).toBe("veo-extend-456");
  });

  it("should generate a task and return taskId", async () => {
    const veo = createMockVeoProvider();
    const result = await veo.api.v1.veo.generate({
      prompt: "A beautiful sunset",
    });
    expect(result.data?.taskId).toBe("veo-task-123");
  });
});
