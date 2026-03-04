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

// Provider interface
export interface XaiProvider {
  chat(req: XaiChatRequest, signal?: AbortSignal): Promise<XaiChatResponse>;
  search(query: string, signal?: AbortSignal): Promise<XaiChatResponse>;
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
