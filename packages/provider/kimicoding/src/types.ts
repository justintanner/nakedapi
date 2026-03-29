export type Role = "user" | "assistant";

export interface Base64ImageSource {
  type: "base64";
  media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  data: string;
}

export interface UrlImageSource {
  type: "url";
  url: string;
}

export type ImageSource = Base64ImageSource | UrlImageSource;

export interface TextContentBlock {
  type: "text";
  text: string;
}

export interface ImageContentBlock {
  type: "image";
  source: ImageSource;
}

export type ContentBlock = TextContentBlock | ImageContentBlock;
export type MessageContent = string | ContentBlock[];

export interface ChatMessage {
  role: Role;
  content: MessageContent;
}

// Raw Anthropic Messages API request shape
export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens: number;
  system?: string;
  temperature?: number;
  top_p?: number;
  stop_sequences?: string[];
  stream?: boolean;
  [key: string]: unknown;
}

// Raw Anthropic content block in response
export interface AnthropicContentBlock {
  type: "text" | "thinking";
  text?: string;
  thinking?: string;
}

// Raw Anthropic Messages API response
export interface AnthropicMessage {
  id: string;
  type: string;
  role: string;
  content: AnthropicContentBlock[];
  model: string;
  stop_reason: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// Raw Anthropic SSE event
export interface AnthropicStreamEvent {
  type: string;
  index?: number;
  delta?: {
    type?: string;
    text?: string;
    stop_reason?: string;
  };
  content_block?: AnthropicContentBlock;
  message?: AnthropicMessage;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
}

// Models API types
export interface KimiCodingModel {
  id: string;
  object: "model";
  created: number;
  created_at: string;
  display_name: string;
  type: string;
  context_length: number;
  supports_reasoning: boolean;
  supports_image_in: boolean;
  supports_video_in: boolean;
}

export interface KimiCodingModelListResponse {
  object: "list";
  data: KimiCodingModel[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

// File upload types
export type FileUploadPurpose = "image" | "video" | "file-extract";

export interface FileUploadRequest {
  file: Blob;
  purpose: FileUploadPurpose;
}

export interface FileObject {
  id: string;
  bytes: number;
  created_at: number;
  filename: string;
  object: "file";
  purpose: FileUploadPurpose;
  status: "ok" | "error" | "created";
  status_details: string;
}

// Search types
export interface SearchRequest {
  text_query: string;
  limit?: number;
  enable_page_crawling?: boolean;
  timeout_seconds?: number;
}

export interface SearchResult {
  site_name: string;
  title: string;
  url: string;
  snippet: string;
  content: string;
  date: string;
  icon: string;
  mime: string;
}

export interface SearchResponse {
  search_results: SearchResult[];
}

// Fetch types
export interface FetchRequest {
  url: string;
}

// Chat completions types (OpenAI-compatible)
export interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  user?: string;
  [key: string]: unknown;
}

export interface ChatCompletionResponseMessage {
  role: string;
  content: string;
  reasoning_content?: string;
}

export interface ChatCompletionChoice {
  index: number;
  message: ChatCompletionResponseMessage;
  finish_reason: string | null;
}

export interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionStreamDelta {
  role?: string;
  content?: string;
}

export interface ChatCompletionStreamChoice {
  index: number;
  delta: ChatCompletionStreamDelta;
  finish_reason: string | null;
}

export interface ChatCompletionStreamEvent {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: ChatCompletionStreamChoice[];
}

// Embeddings request (OpenAI-compatible)
export interface EmbeddingRequest {
  input: string | string[] | number[] | number[][];
  model: string;
  encoding_format?: "float" | "base64";
  dimensions?: number;
  user?: string;
}

// Embeddings response
export interface EmbeddingData {
  index: number;
  embedding: number[];
}

export interface EmbeddingResponse {
  object: "list";
  data: EmbeddingData[];
  model: string;
}

// Payload schema types
export interface PayloadFieldSchema {
  type: "string" | "number" | "boolean" | "array" | "object";
  required?: boolean;
  description?: string;
  enum?: readonly (string | number | boolean)[];
  items?: PayloadFieldSchema;
  properties?: Record<string, PayloadFieldSchema>;
}

export interface PayloadSchema {
  method: "POST" | "DELETE";
  path: string;
  contentType: "application/json" | "multipart/form-data";
  fields: Record<string, PayloadFieldSchema>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Namespace types
interface KimiCodingStreamMethod {
  (req: ChatRequest, signal?: AbortSignal): AsyncIterable<AnthropicStreamEvent>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingMessagesNamespace {
  (req: ChatRequest, signal?: AbortSignal): Promise<AnthropicMessage>;
  stream: KimiCodingStreamMethod;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingModelsListMethod {
  (signal?: AbortSignal): Promise<KimiCodingModelListResponse>;
}

interface KimiCodingModelsNamespace {
  list: KimiCodingModelsListMethod;
}

interface KimiCodingEmbeddingsMethod {
  (req: EmbeddingRequest, signal?: AbortSignal): Promise<EmbeddingResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingFilesUploadMethod {
  (req: FileUploadRequest, signal?: AbortSignal): Promise<FileObject>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingFilesNamespace {
  upload: KimiCodingFilesUploadMethod;
}

interface KimiCodingSearchMethod {
  (req: SearchRequest, signal?: AbortSignal): Promise<SearchResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingFetchMethod {
  (req: FetchRequest, signal?: AbortSignal): Promise<string>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingChatCompletionsStreamMethod {
  (
    req: ChatCompletionRequest,
    signal?: AbortSignal
  ): AsyncIterable<ChatCompletionStreamEvent>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingChatCompletionsMethod {
  (
    req: ChatCompletionRequest,
    signal?: AbortSignal
  ): Promise<ChatCompletionResponse>;
  stream: KimiCodingChatCompletionsStreamMethod;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface KimiCodingChatNamespace {
  completions: KimiCodingChatCompletionsMethod;
}

interface KimiCodingV1Namespace {
  messages: KimiCodingMessagesNamespace;
  models: KimiCodingModelsNamespace;
  embeddings: KimiCodingEmbeddingsMethod;
  files: KimiCodingFilesNamespace;
  search: KimiCodingSearchMethod;
  fetch: KimiCodingFetchMethod;
  chat: KimiCodingChatNamespace;
}

interface KimiCodingCodingNamespace {
  v1: KimiCodingV1Namespace;
}

export interface Provider {
  coding: KimiCodingCodingNamespace;
}

export interface KimiCodingOptions {
  apiKey: string;
  baseURL?: string;
  maxRetries?: number;
  timeout?: number;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export class KimiCodingError extends Error {
  readonly status: number;
  readonly body: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "KimiCodingError";
    this.status = status;
    this.body = body ?? null;
  }
}

export interface KimiCodingProvider extends Provider {}
