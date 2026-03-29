// Google Gemini provider options
export interface GeminiOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

// --- Shared types ---

export interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
  fileData?: { mimeType: string; fileUri: string };
  functionCall?: { name: string; args: Record<string, unknown> };
  functionResponse?: { name: string; response: Record<string, unknown> };
  executableCode?: { language: string; code: string };
  codeExecutionResult?: { outcome: string; output: string };
}

export interface GeminiContent {
  role?: "user" | "model";
  parts: GeminiPart[];
}

export interface GeminiToolFunctionDeclaration {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface GeminiTool {
  functionDeclarations?: GeminiToolFunctionDeclaration[];
  googleSearch?: Record<string, unknown>;
  codeExecution?: Record<string, unknown>;
}

export interface GeminiToolConfig {
  functionCallingConfig?: {
    mode?: "AUTO" | "ANY" | "NONE";
    allowedFunctionNames?: string[];
  };
}

export interface GeminiSafetySetting {
  category: string;
  threshold: string;
}

export interface GeminiGenerationConfig {
  candidateCount?: number;
  stopSequences?: string[];
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  responseMimeType?: string;
  responseSchema?: Record<string, unknown>;
  responseModalities?: string[];
  imageConfig?: {
    aspectRatio?: string;
    imageSize?: string;
  };
  thinkingConfig?: {
    thinkingLevel?: string;
    includeThoughts?: boolean;
    thinkingBudget?: number;
  };
}

// --- generateContent / streamGenerateContent ---

export interface GeminiGenerateContentRequest {
  model: string;
  contents: GeminiContent[];
  tools?: GeminiTool[];
  toolConfig?: GeminiToolConfig;
  safetySettings?: GeminiSafetySetting[];
  systemInstruction?: GeminiContent;
  generationConfig?: GeminiGenerationConfig;
  cachedContent?: string;
}

export interface GeminiSafetyRating {
  category: string;
  probability: string;
  blocked?: boolean;
}

export interface GeminiCitationSource {
  startIndex?: number;
  endIndex?: number;
  uri?: string;
  license?: string;
}

export interface GeminiCitationMetadata {
  citationSources: GeminiCitationSource[];
}

export interface GeminiGroundingMetadata {
  webSearchQueries?: string[];
  searchEntryPoint?: { renderedContent: string };
  groundingChunks?: Array<{
    web?: { uri: string; title: string };
  }>;
  groundingSupports?: Array<{
    segment?: { startIndex: number; endIndex: number; text: string };
    groundingChunkIndices?: number[];
    confidenceScores?: number[];
  }>;
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?:
    | "STOP"
    | "MAX_TOKENS"
    | "SAFETY"
    | "RECITATION"
    | "OTHER"
    | "BLOCKLIST"
    | "PROHIBITED_CONTENT"
    | "SPII"
    | "MALFORMED_FUNCTION_CALL";
  safetyRatings?: GeminiSafetyRating[];
  citationMetadata?: GeminiCitationMetadata;
  tokenCount?: number;
  groundingMetadata?: GeminiGroundingMetadata;
  index: number;
}

export interface GeminiModalityTokenCount {
  modality: string;
  tokenCount: number;
}

export interface GeminiUsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount?: number;
  totalTokenCount: number;
  cachedContentTokenCount?: number;
  promptTokensDetails?: GeminiModalityTokenCount[];
  candidatesTokensDetails?: GeminiModalityTokenCount[];
  cacheTokensDetails?: GeminiModalityTokenCount[];
}

export interface GeminiPromptFeedback {
  blockReason?: string;
  safetyRatings?: GeminiSafetyRating[];
}

export interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
  usageMetadata?: GeminiUsageMetadata;
  modelVersion?: string;
  responseId?: string;
}

// --- countTokens ---

export interface GeminiCountTokensRequest {
  model: string;
  contents?: GeminiContent[];
  generateContentRequest?: GeminiGenerateContentRequest;
}

export interface GeminiCountTokensResponse {
  totalTokens: number;
  cachedContentTokenCount?: number;
  promptTokensDetails?: GeminiModalityTokenCount[];
  cacheTokensDetails?: GeminiModalityTokenCount[];
}

// --- embedContent ---

export interface GeminiEmbedContentRequest {
  model: string;
  content: GeminiContent;
  taskType?:
    | "RETRIEVAL_QUERY"
    | "RETRIEVAL_DOCUMENT"
    | "SEMANTIC_SIMILARITY"
    | "CLASSIFICATION"
    | "CLUSTERING"
    | "QUESTION_ANSWERING"
    | "FACT_VERIFICATION"
    | "CODE_RETRIEVAL_QUERY";
  title?: string;
  outputDimensionality?: number;
}

export interface GeminiContentEmbedding {
  values: number[];
}

export interface GeminiEmbedContentResponse {
  embedding: GeminiContentEmbedding;
}

// --- batchEmbedContents ---

export interface GeminiBatchEmbedContentsRequest {
  model: string;
  requests: Array<Omit<GeminiEmbedContentRequest, "model">>;
}

export interface GeminiBatchEmbedContentsResponse {
  embeddings: GeminiContentEmbedding[];
}

// --- predict (Imagen) ---

export interface GeminiPredictRequest {
  model: string;
  instances: Array<Record<string, unknown>>;
  parameters?: Record<string, unknown>;
}

export interface GeminiPredictResponse {
  predictions?: Array<Record<string, unknown>>;
  metadata?: Record<string, unknown>;
}

// --- predictLongRunning (Veo) ---

export interface GeminiPredictLongRunningRequest {
  model: string;
  instances: Array<Record<string, unknown>>;
  parameters?: Record<string, unknown>;
}

export interface GeminiOperation {
  name: string;
  done?: boolean;
  metadata?: Record<string, unknown>;
  response?: Record<string, unknown>;
  error?: { code: number; message: string; details?: unknown[] };
}

// --- batchGenerateContent ---

export interface GeminiBatchGenerateContentRequest {
  model: string;
  requests: Array<Omit<GeminiGenerateContentRequest, "model">>;
}

export interface GeminiBatchGenerateContentResponse {
  responses: GeminiGenerateContentResponse[];
}

// --- Models ---

export interface GeminiModel {
  name: string;
  baseModelId?: string;
  version: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
  temperature?: number;
  maxTemperature?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiModelListParams {
  pageSize?: number;
  pageToken?: string;
}

export interface GeminiModelListResponse {
  models: GeminiModel[];
  nextPageToken?: string;
}

// --- Files ---

export interface GeminiFileVideoMetadata {
  videoDuration: string;
}

export interface GeminiFile {
  name: string;
  displayName?: string;
  mimeType: string;
  sizeBytes: string;
  createTime: string;
  updateTime: string;
  expirationTime?: string;
  sha256Hash?: string;
  uri: string;
  downloadUri?: string;
  state: "PROCESSING" | "ACTIVE" | "FAILED";
  source?: "UPLOADED" | "GENERATED" | "REGISTERED";
  error?: { code: number; message: string };
  videoMetadata?: GeminiFileVideoMetadata;
}

export interface GeminiFileUploadRequest {
  file: Blob;
  displayName?: string;
  mimeType?: string;
}

export interface GeminiFileUploadResponse {
  file: GeminiFile;
}

export interface GeminiFileCreateRequest {
  file: {
    displayName?: string;
    uri?: string;
    mimeType?: string;
  };
}

export interface GeminiFileListParams {
  pageSize?: number;
  pageToken?: string;
}

export interface GeminiFileListResponse {
  files?: GeminiFile[];
  nextPageToken?: string;
}

// --- Cached Contents ---

export interface GeminiCachedContent {
  name?: string;
  model: string;
  displayName?: string;
  contents?: GeminiContent[];
  tools?: GeminiTool[];
  systemInstruction?: GeminiContent;
  toolConfig?: GeminiToolConfig;
  expireTime?: string;
  ttl?: string;
  createTime?: string;
  updateTime?: string;
  usageMetadata?: { totalTokenCount: number };
}

export interface GeminiCachedContentCreateRequest {
  model: string;
  displayName?: string;
  contents?: GeminiContent[];
  tools?: GeminiTool[];
  systemInstruction?: GeminiContent;
  toolConfig?: GeminiToolConfig;
  expireTime?: string;
  ttl?: string;
}

export interface GeminiCachedContentUpdateRequest {
  expireTime?: string;
  ttl?: string;
  displayName?: string;
}

export interface GeminiCachedContentListParams {
  pageSize?: number;
  pageToken?: string;
}

export interface GeminiCachedContentListResponse {
  cachedContents?: GeminiCachedContent[];
  nextPageToken?: string;
}

// --- Tuned Models ---

export interface GeminiTuningSnapshot {
  step: number;
  epoch: number;
  meanLoss: number;
  computeTime: string;
}

export interface GeminiTuningTask {
  startTime?: string;
  completeTime?: string;
  snapshots?: GeminiTuningSnapshot[];
  trainingData: {
    examples?: {
      examples: Array<{
        textInput: string;
        output: string;
      }>;
    };
  };
  hyperparameters?: {
    epochCount?: number;
    batchSize?: number;
    learningRate?: number;
  };
}

export interface GeminiTunedModel {
  name?: string;
  displayName?: string;
  description?: string;
  state?: "STATE_UNSPECIFIED" | "CREATING" | "ACTIVE" | "FAILED";
  createTime?: string;
  updateTime?: string;
  tuningTask?: GeminiTuningTask;
  baseModel?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiTunedModelCreateRequest {
  displayName?: string;
  description?: string;
  baseModel: string;
  tuningTask: {
    trainingData: {
      examples: {
        examples: Array<{
          textInput: string;
          output: string;
        }>;
      };
    };
    hyperparameters?: {
      epochCount?: number;
      batchSize?: number;
      learningRate?: number;
    };
  };
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiTunedModelUpdateRequest {
  displayName?: string;
  description?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiTunedModelListParams {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
}

export interface GeminiTunedModelListResponse {
  tunedModels?: GeminiTunedModel[];
  nextPageToken?: string;
}

export interface GeminiTransferOwnershipRequest {
  emailAddress: string;
}

// --- Tuned Model Permissions ---

export interface GeminiPermission {
  name?: string;
  granteeType?: "EVERYONE" | "USER" | "GROUP";
  emailAddress?: string;
  role?: "READER" | "WRITER" | "OWNER";
}

export interface GeminiPermissionListParams {
  pageSize?: number;
  pageToken?: string;
}

export interface GeminiPermissionListResponse {
  permissions?: GeminiPermission[];
  nextPageToken?: string;
}

// --- Batches ---

export interface GeminiBatch {
  name: string;
  displayName?: string;
  state?:
    | "STATE_UNSPECIFIED"
    | "JOB_STATE_PENDING"
    | "JOB_STATE_SUCCEEDED"
    | "JOB_STATE_FAILED"
    | "JOB_STATE_CANCELLING"
    | "JOB_STATE_CANCELLED";
  createTime?: string;
  updateTime?: string;
  src?: Record<string, unknown>;
  dest?: Record<string, unknown>;
}

export interface GeminiBatchListParams {
  pageSize?: number;
  pageToken?: string;
}

export interface GeminiBatchListResponse {
  batches?: GeminiBatch[];
  nextPageToken?: string;
}

// --- Schema / Validation types ---

export interface PayloadFieldSchema {
  type: "string" | "number" | "boolean" | "array" | "object";
  required?: boolean;
  description?: string;
  enum?: readonly (string | number | boolean)[];
  items?: PayloadFieldSchema;
  properties?: Record<string, PayloadFieldSchema>;
}

export interface PayloadSchema {
  method: "POST" | "DELETE" | "PATCH";
  path: string;
  contentType: "application/json" | "multipart/form-data";
  fields: Record<string, PayloadFieldSchema>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// --- Method interfaces ---

interface GeminiGenerateContentMethod {
  (
    req: GeminiGenerateContentRequest,
    signal?: AbortSignal
  ): Promise<GeminiGenerateContentResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiStreamGenerateContentMethod {
  (
    req: GeminiGenerateContentRequest,
    signal?: AbortSignal
  ): AsyncGenerator<GeminiGenerateContentResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiCountTokensMethod {
  (
    req: GeminiCountTokensRequest,
    signal?: AbortSignal
  ): Promise<GeminiCountTokensResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiEmbedContentMethod {
  (
    req: GeminiEmbedContentRequest,
    signal?: AbortSignal
  ): Promise<GeminiEmbedContentResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiBatchEmbedContentsMethod {
  (
    req: GeminiBatchEmbedContentsRequest,
    signal?: AbortSignal
  ): Promise<GeminiBatchEmbedContentsResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiPredictMethod {
  (
    req: GeminiPredictRequest,
    signal?: AbortSignal
  ): Promise<GeminiPredictResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiPredictLongRunningMethod {
  (
    req: GeminiPredictLongRunningRequest,
    signal?: AbortSignal
  ): Promise<GeminiOperation>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiBatchGenerateContentMethod {
  (
    req: GeminiBatchGenerateContentRequest,
    signal?: AbortSignal
  ): Promise<GeminiBatchGenerateContentResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiCachedContentCreateMethod {
  (
    req: GeminiCachedContentCreateRequest,
    signal?: AbortSignal
  ): Promise<GeminiCachedContent>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface GeminiTunedModelCreateMethod {
  (
    req: GeminiTunedModelCreateRequest,
    signal?: AbortSignal
  ): Promise<GeminiOperation>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

// --- Namespace interfaces ---

interface GeminiModelsNamespace {
  (
    modelIdOrSignal?: string | AbortSignal,
    signal?: AbortSignal
  ): Promise<GeminiModelListResponse | GeminiModel>;
  generateContent: GeminiGenerateContentMethod;
  streamGenerateContent: GeminiStreamGenerateContentMethod;
  countTokens: GeminiCountTokensMethod;
  embedContent: GeminiEmbedContentMethod;
  batchEmbedContents: GeminiBatchEmbedContentsMethod;
  predict: GeminiPredictMethod;
  predictLongRunning: GeminiPredictLongRunningMethod;
  batchGenerateContent: GeminiBatchGenerateContentMethod;
}

interface GeminiFilesNamespace {
  upload(
    req: GeminiFileUploadRequest,
    signal?: AbortSignal
  ): Promise<GeminiFileUploadResponse>;
  create(
    req: GeminiFileCreateRequest,
    signal?: AbortSignal
  ): Promise<GeminiFile>;
  get(name: string, signal?: AbortSignal): Promise<GeminiFile>;
  list(
    params?: GeminiFileListParams,
    signal?: AbortSignal
  ): Promise<GeminiFileListResponse>;
  delete(name: string, signal?: AbortSignal): Promise<void>;
}

interface GeminiPermissionsNamespace {
  create(
    parent: string,
    req: GeminiPermission,
    signal?: AbortSignal
  ): Promise<GeminiPermission>;
  get(name: string, signal?: AbortSignal): Promise<GeminiPermission>;
  list(
    parent: string,
    params?: GeminiPermissionListParams,
    signal?: AbortSignal
  ): Promise<GeminiPermissionListResponse>;
  update(
    name: string,
    req: GeminiPermission,
    updateMask?: string,
    signal?: AbortSignal
  ): Promise<GeminiPermission>;
  delete(name: string, signal?: AbortSignal): Promise<void>;
}

interface GeminiTunedModelsNamespace {
  create: GeminiTunedModelCreateMethod;
  get(name: string, signal?: AbortSignal): Promise<GeminiTunedModel>;
  list(
    params?: GeminiTunedModelListParams,
    signal?: AbortSignal
  ): Promise<GeminiTunedModelListResponse>;
  update(
    name: string,
    req: GeminiTunedModelUpdateRequest,
    updateMask?: string,
    signal?: AbortSignal
  ): Promise<GeminiTunedModel>;
  delete(name: string, signal?: AbortSignal): Promise<void>;
  generateContent: GeminiGenerateContentMethod;
  transferOwnership(
    name: string,
    req: GeminiTransferOwnershipRequest,
    signal?: AbortSignal
  ): Promise<void>;
  permissions: GeminiPermissionsNamespace;
}

interface GeminiCachedContentsNamespace {
  create: GeminiCachedContentCreateMethod;
  get(name: string, signal?: AbortSignal): Promise<GeminiCachedContent>;
  list(
    params?: GeminiCachedContentListParams,
    signal?: AbortSignal
  ): Promise<GeminiCachedContentListResponse>;
  update(
    name: string,
    req: GeminiCachedContentUpdateRequest,
    updateMask?: string,
    signal?: AbortSignal
  ): Promise<GeminiCachedContent>;
  delete(name: string, signal?: AbortSignal): Promise<void>;
}

interface GeminiBatchesNamespace {
  get(name: string, signal?: AbortSignal): Promise<GeminiBatch>;
  list(
    params?: GeminiBatchListParams,
    signal?: AbortSignal
  ): Promise<GeminiBatchListResponse>;
  cancel(name: string, signal?: AbortSignal): Promise<GeminiBatch>;
  delete(name: string, signal?: AbortSignal): Promise<void>;
}

interface GeminiOperationsNamespace {
  get(name: string, signal?: AbortSignal): Promise<GeminiOperation>;
  cancel(name: string, signal?: AbortSignal): Promise<void>;
}

interface GeminiV1betaNamespace {
  models: GeminiModelsNamespace;
  files: GeminiFilesNamespace;
  cachedContents: GeminiCachedContentsNamespace;
  tunedModels: GeminiTunedModelsNamespace;
  batches: GeminiBatchesNamespace;
  operations: GeminiOperationsNamespace;
}

// Provider interface
export interface GeminiProvider {
  v1beta: GeminiV1betaNamespace;
}

// Error class
export class GeminiError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly code?: string;

  constructor(message: string, status: number, body?: unknown, code?: string) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
    this.body = body ?? null;
    this.code = code;
  }
}
