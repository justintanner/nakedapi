// XAI provider options
export interface XaiOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

// Chat message
export interface XaiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Tool function definition
export interface XaiToolFunction {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

// Tool definition
export interface XaiTool {
  type: "function";
  function: XaiToolFunction;
}

// Tool call in response
export interface XaiToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

// Usage info
export interface XaiUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// Chat request
export interface XaiChatRequest {
  model?: string;
  messages: XaiMessage[];
  temperature?: number;
  max_tokens?: number;
  tools?: XaiTool[];
  tool_choice?:
    | "auto"
    | "none"
    | { type: "function"; function: { name: string } };
}

// Chat response
export interface XaiChatResponse {
  content: string;
  model: string;
  usage: XaiUsage;
  finishReason: string;
  toolCalls?: XaiToolCall[];
}

// Image generation request
export interface XaiImageGenerateRequest {
  prompt: string;
  model?: string;
  n?: number;
  response_format?: "url" | "b64_json";
  aspect_ratio?: string;
  resolution?: "1k" | "2k";
}

// Image reference for editing
export interface XaiImageReference {
  url: string;
  type?: "image_url";
}

// Image editing request
export interface XaiImageEditRequest {
  prompt: string;
  model?: string;
  image?: XaiImageReference;
  images?: XaiImageReference[];
  n?: number;
  response_format?: "url" | "b64_json";
  aspect_ratio?: string;
}

// Single generated image data
export interface XaiGeneratedImage {
  url?: string;
  b64_json?: string;
  revised_prompt?: string;
}

// Image response
export interface XaiImageResponse {
  data: XaiGeneratedImage[];
}

// Provider interface
export interface XaiProvider {
  chat(req: XaiChatRequest, signal?: AbortSignal): Promise<XaiChatResponse>;
  search(query: string, signal?: AbortSignal): Promise<XaiChatResponse>;
  generateImage(
    req: XaiImageGenerateRequest,
    signal?: AbortSignal
  ): Promise<XaiImageResponse>;
  editImage(
    req: XaiImageEditRequest,
    signal?: AbortSignal
  ): Promise<XaiImageResponse>;
}

// Error class
export class XaiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "XaiError";
    this.status = status;
    this.code = code;
  }
}
