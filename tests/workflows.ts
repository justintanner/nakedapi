export interface WorkflowAsyncConfig {
  pollUrl: string;
  pollMethod: "GET";
  completionField: string;
  completionValues: string[];
  failureValues: string[];
  progressField?: string;
  outputExtractors: Record<string, string>;
}

export interface WorkflowStepDefinition {
  name: string;
  description: string;
  apiProvider: "xai" | "kie";
  request: {
    method: "POST" | "GET";
    url: string;
    body?: Record<string, unknown>;
  };
  outputExtractors: Record<string, string>;
  async?: WorkflowAsyncConfig;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStepDefinition[];
}

export interface StepState {
  status: "locked" | "ready" | "running" | "completed" | "failed";
  request?: { method: string; url: string; body: unknown };
  response?: { status: number; body: unknown };
  outputs?: Record<string, string>;
  error?: string;
  completedAt?: string;
}

export interface WorkflowState {
  [workflowId: string]: {
    steps: Record<string, StepState>;
  };
}

// --- Template resolution ---

export function resolveTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in vars))
      throw new Error(`Missing workflow variable: {{${key}}}`);
    return vars[key];
  });
}

export function resolveBody(
  body: unknown,
  vars: Record<string, string>
): unknown {
  if (typeof body === "string") return resolveTemplate(body, vars);
  if (Array.isArray(body)) return body.map((item) => resolveBody(item, vars));
  if (typeof body === "object" && body !== null) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body)) {
      result[k] = resolveBody(v, vars);
    }
    return result;
  }
  return body;
}

// --- Output extraction ---

export function extractByPath(obj: unknown, dotPath: string): string | null {
  const parts = dotPath.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string"
    ? current
    : current != null
      ? String(current)
      : null;
}

export function extractOutputs(
  body: unknown,
  extractors: Record<string, string>
): Record<string, string> {
  const outputs: Record<string, string> = {};
  for (const [key, path] of Object.entries(extractors)) {
    const value = extractByPath(body, path);
    if (value) outputs[key] = value;
  }
  return outputs;
}

// --- Collect all outputs from completed preceding steps ---

export function collectVars(
  state: Record<string, StepState>,
  upToStep: number
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (let i = 0; i < upToStep; i++) {
    const step = state[String(i)];
    if (step?.outputs) Object.assign(vars, step.outputs);
  }
  return vars;
}

// --- API key lookup ---

export function getApiKey(provider: "xai" | "kie"): string | undefined {
  if (provider === "xai") return process.env.XAI_API_KEY;
  if (provider === "kie") return process.env.KIE_API_KEY;
  return undefined;
}

// --- Workflow definitions ---

export const workflows: WorkflowDefinition[] = [
  {
    id: "grok-imagine-astronaut-cliff",
    name: "Grok Imagine: astronaut cliff",
    steps: [
      {
        name: "Generate image",
        description:
          "Establish the scene — astronaut at an alien cliff edge at sunset",
        apiProvider: "xai",
        request: {
          method: "POST",
          url: "https://api.x.ai/v1/images/generations",
          body: {
            model: "grok-imagine-image",
            prompt:
              "A lone astronaut in a white spacesuit standing at the edge " +
              "of a towering basalt cliff, overlooking a vast bioluminescent " +
              "alien ocean at sunset. Two pale moons hang low on the horizon, " +
              "casting long purple shadows across the rock. Cinematic wide " +
              "shot, 4K, sci-fi concept art style.",
            n: 1,
            response_format: "url",
          },
        },
        outputExtractors: { image_url: "data[0].url" },
      },
      {
        name: "Image to video",
        description: "Animate the scene — astronaut approaches the cliff edge",
        apiProvider: "xai",
        request: {
          method: "POST",
          url: "https://api.x.ai/v1/videos/generations",
          body: {
            model: "grok-imagine-video",
            prompt:
              "The astronaut takes a cautious step toward the cliff edge " +
              "and looks down. Bioluminescent waves crash against the rocks " +
              "far below, sending up faint glowing spray. The two moons " +
              "drift higher, their light intensifying. Camera slowly pushes " +
              "in toward the astronaut from behind. Cinematic, slow motion.",
            image_url: "{{image_url}}",
          },
        },
        outputExtractors: { request_id: "request_id" },
        async: {
          pollUrl: "https://api.x.ai/v1/videos/{{request_id}}",
          pollMethod: "GET",
          completionField: "status",
          completionValues: ["done"],
          failureValues: ["failed", "expired"],
          progressField: "progress",
          outputExtractors: { video_url: "video.url" },
        },
      },
      {
        name: "Extend video",
        description: "The leap — astronaut jumps off the cliff with a jetpack",
        apiProvider: "xai",
        request: {
          method: "POST",
          url: "https://api.x.ai/v1/videos/generations",
          body: {
            model: "grok-imagine-video",
            prompt:
              "The astronaut crouches and leaps off the cliff into the void. " +
              "A jetpack ignites with a bright blue flame and the astronaut " +
              "soars out over the glowing ocean, banking left between the " +
              "two moons. The bioluminescent water below ripples in response " +
              "to the engine wash. Camera follows in a sweeping aerial " +
              "tracking shot. Cinematic, epic scale.",
            video_url: "{{video_url}}",
          },
        },
        outputExtractors: { request_id: "request_id" },
        async: {
          pollUrl: "https://api.x.ai/v1/videos/{{request_id}}",
          pollMethod: "GET",
          completionField: "status",
          completionValues: ["done"],
          failureValues: ["failed", "expired"],
          progressField: "progress",
          outputExtractors: { video_url: "video.url" },
        },
      },
    ],
  },
];
