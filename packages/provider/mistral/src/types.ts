// Mistral provider options
export interface MistralOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

// Error class
export class MistralError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly code?: string;

  constructor(message: string, status: number, body?: unknown, code?: string) {
    super(message);
    this.name = "MistralError";
    this.status = status;
    this.body = body ?? null;
    this.code = code;
  }
}

// --- Validation types ---
export interface PayloadFieldSchema {
  type: "string" | "number" | "boolean" | "array" | "object";
  required?: boolean;
  description?: string;
  enum?: readonly (string | number | boolean)[];
  items?: PayloadFieldSchema;
  properties?: Record<string, PayloadFieldSchema>;
}

export interface PayloadSchema {
  method: "POST" | "GET" | "DELETE" | "PATCH" | "PUT";
  path: string;
  contentType: "application/json" | "multipart/form-data";
  fields: Record<string, PayloadFieldSchema>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// --- Chat types ---

export interface MistralMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string | MistralContentPart[];
  name?: string;
  tool_calls?: MistralToolCall[];
  tool_call_id?: string;
  prefix?: boolean;
}

export interface MistralTextPart {
  type: "text";
  text: string;
}

export interface MistralImageUrlPart {
  type: "image_url";
  image_url: { url: string; detail?: string };
}

export interface MistralDocumentUrlPart {
  type: "document_url";
  document_url: { url: string };
}

export type MistralContentPart =
  | MistralTextPart
  | MistralImageUrlPart
  | MistralDocumentUrlPart;

export interface MistralToolFunction {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
  strict?: boolean;
}

export interface MistralTool {
  type: "function";
  function: MistralToolFunction;
}

export interface MistralToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
  index?: number;
}

export interface MistralUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface MistralChatRequest {
  model: string;
  messages: MistralMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  random_seed?: number;
  stream?: boolean;
  safe_prompt?: boolean;
  tools?: MistralTool[];
  tool_choice?: "auto" | "none" | "any" | "required";
  response_format?: { type: "text" | "json_object" };
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  n?: number;
}

export interface MistralChatChoice {
  index: number;
  message: {
    role: string;
    content: string | null;
    tool_calls?: MistralToolCall[];
    prefix?: boolean;
  };
  finish_reason: string | null;
}

export interface MistralChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: MistralChatChoice[];
  usage?: MistralUsage;
}

// --- FIM types ---

export interface MistralFimRequest {
  model: string;
  prompt: string;
  suffix?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  random_seed?: number;
  stream?: boolean;
  stop?: string | string[];
  min_tokens?: number;
}

export interface MistralFimChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string | null;
}

export interface MistralFimResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: MistralFimChoice[];
  usage?: MistralUsage;
}

// --- Embeddings types ---

export interface MistralEmbeddingRequest {
  model: string;
  input: string | string[];
  encoding_format?: "float";
}

export interface MistralEmbeddingData {
  object: "embedding";
  embedding: number[];
  index: number;
}

export interface MistralEmbeddingUsage {
  prompt_tokens: number;
  total_tokens: number;
}

export interface MistralEmbeddingResponse {
  id: string;
  object: "list";
  data: MistralEmbeddingData[];
  model: string;
  usage: MistralEmbeddingUsage;
}

// --- OCR types ---

export interface MistralOcrDocumentSource {
  type: "document_url" | "image_url" | "base64";
  document_url?: string;
  image_url?: string;
  data?: string;
}

export interface MistralOcrRequest {
  model: string;
  document: MistralOcrDocumentSource;
  id?: string;
  pages?: number[];
  include_image_base64?: boolean;
  image_limit?: number;
  image_min_size?: number;
}

export interface MistralOcrBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MistralOcrImage {
  id: string;
  top_left_x: number;
  top_left_y: number;
  bottom_right_x: number;
  bottom_right_y: number;
  image_base64?: string;
}

export interface MistralOcrPageDimension {
  dpi: number;
  height: number;
  width: number;
}

export interface MistralOcrPage {
  index: number;
  markdown: string;
  images: MistralOcrImage[];
  dimensions: MistralOcrPageDimension;
}

export interface MistralOcrUsage {
  pages_processed: number;
  doc_size_bytes?: number;
}

export interface MistralOcrResponse {
  pages: MistralOcrPage[];
  model: string;
  usage_info: MistralOcrUsage;
}

// --- Moderation types ---

export interface MistralModerationRequest {
  model?: string;
  input: string | string[];
}

export interface MistralModerationCategories {
  sexual: boolean;
  hate_and_discrimination: boolean;
  violence_and_threats: boolean;
  dangerous_and_criminal_content: boolean;
  selfharm: boolean;
  health: boolean;
  financial: boolean;
  law: boolean;
  pii: boolean;
}

export interface MistralModerationCategoryScores {
  sexual: number;
  hate_and_discrimination: number;
  violence_and_threats: number;
  dangerous_and_criminal_content: number;
  selfharm: number;
  health: number;
  financial: number;
  law: number;
  pii: number;
}

export interface MistralModerationResult {
  categories: MistralModerationCategories;
  category_scores: MistralModerationCategoryScores;
}

export interface MistralModerationResponse {
  id: string;
  model: string;
  results: MistralModerationResult[];
}

// --- Chat Moderation types ---

export interface MistralChatModerationRequest {
  model?: string;
  input: MistralMessage[];
}

export interface MistralChatModerationResponse {
  id: string;
  model: string;
  results: MistralModerationResult[];
}

// --- Classification types ---

export interface MistralClassificationRequest {
  model: string;
  input: string | string[];
}

export interface MistralClassificationResult {
  categories: Record<string, boolean>;
  category_scores: Record<string, number>;
}

export interface MistralClassificationResponse {
  id: string;
  model: string;
  results: MistralClassificationResult[];
}

// --- Chat Classification types ---

export interface MistralChatClassificationRequest {
  model: string;
  input: MistralMessage[];
}

export interface MistralChatClassificationResponse {
  id: string;
  model: string;
  results: MistralClassificationResult[];
}

// --- Models types ---

export interface MistralModelPermission {
  id: string;
  object: string;
  created: number;
  allow_create_engine: boolean;
  allow_sampling: boolean;
  allow_logprobs: boolean;
  allow_search_indices: boolean;
  allow_view: boolean;
  allow_fine_tuning: boolean;
  organization: string;
  group: string | null;
  is_blocking: boolean;
}

export interface MistralModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  name?: string;
  description?: string;
  max_context_length?: number;
  aliases?: string[];
  deprecation?: string;
  default_model_temperature?: number;
  type?: string;
  capabilities?: Record<string, unknown>;
}

export interface MistralModelListResponse {
  object: "list";
  data: MistralModel[];
}

export interface MistralModelDeleteResponse {
  id: string;
  object: string;
  deleted: boolean;
}

// --- Files types ---

export interface MistralFile {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
  sample_type?: string;
  num_lines?: number;
  source?: string;
}

export interface MistralFileListResponse {
  object: "list";
  data: MistralFile[];
}

export interface MistralFileDeleteResponse {
  id: string;
  object: string;
  deleted: boolean;
}

export interface MistralFileUrlResponse {
  url: string;
  expires_at?: number;
}

// --- Fine-tuning types ---

export interface MistralFineTuningHyperparameters {
  training_steps?: number;
  learning_rate?: number;
  weight_decay?: number;
  warmup_fraction?: number;
  epochs?: number;
  fim_ratio?: number;
  seq_len?: number;
}

export interface MistralFineTuningTrainingFile {
  file_id: string;
  weight?: number;
}

export interface MistralFineTuningIntegration {
  type: "wandb";
  project: string;
  name?: string;
  api_key?: string;
  run_name?: string;
}

export interface MistralFineTuningJobCreateRequest {
  model: string;
  training_files: MistralFineTuningTrainingFile[];
  validation_files?: string[];
  hyperparameters?: MistralFineTuningHyperparameters;
  suffix?: string;
  integrations?: MistralFineTuningIntegration[];
  auto_start?: boolean;
  training_steps?: number;
  repositories?: MistralFineTuningRepository[];
}

export interface MistralFineTuningRepository {
  type: "github";
  name: string;
  owner: string;
  ref?: string;
  weight?: number;
  commit?: string;
  token?: string;
}

export interface MistralFineTuningEvent {
  name: string;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface MistralFineTuningCheckpoint {
  metrics: Record<string, number>;
  step_number: number;
  created_at: string;
}

export interface MistralFineTuningJob {
  id: string;
  hyperparameters: MistralFineTuningHyperparameters;
  model: string;
  status: string;
  job_type: string;
  created_at: number;
  modified_at: number;
  training_files: string[];
  validation_files?: string[];
  object: string;
  fine_tuned_model?: string;
  suffix?: string;
  integrations?: MistralFineTuningIntegration[];
  trained_tokens?: number;
  auto_start?: boolean;
  events?: MistralFineTuningEvent[];
  checkpoints?: MistralFineTuningCheckpoint[];
  metadata?: Record<string, unknown>;
  repositories?: MistralFineTuningRepository[];
}

export interface MistralFineTuningJobListParams {
  page?: number;
  page_size?: number;
  model?: string;
  created_after?: string;
  created_by_me?: boolean;
  status?:
    | "QUEUED"
    | "STARTED"
    | "VALIDATING"
    | "VALIDATED"
    | "RUNNING"
    | "FAILED_VALIDATION"
    | "FAILED"
    | "SUCCESS"
    | "CANCELLED"
    | "CANCELLATION_REQUESTED";
  wandb_project?: string;
  wandb_name?: string;
  suffix?: string;
}

export interface MistralFineTuningJobListResponse {
  object: "list";
  data: MistralFineTuningJob[];
  total: number;
}

export interface MistralFineTuningModelUpdateRequest {
  name?: string;
  description?: string;
}

export interface MistralFineTuningModelArchiveResponse {
  id: string;
  object: string;
  archived: boolean;
}

// --- Batch types ---

export interface MistralBatchJobCreateRequest {
  input_files: string[];
  endpoint: string;
  model: string;
  metadata?: Record<string, string>;
  timeout_hours?: number;
}

export interface MistralBatchJob {
  id: string;
  object: string;
  input_files: string[];
  endpoint: string;
  model: string;
  output_file?: string;
  error_file?: string;
  status: string;
  created_at: number;
  started_at?: number;
  completed_at?: number;
  metadata?: Record<string, string>;
  errors?: string[];
  total_requests?: number;
  completed_requests?: number;
  succeeded_requests?: number;
  failed_requests?: number;
}

export interface MistralBatchJobListParams {
  page?: number;
  page_size?: number;
  model?: string;
  metadata?: Record<string, string>;
  created_after?: string;
  created_by_me?: boolean;
  status?: string;
}

export interface MistralBatchJobListResponse {
  object: "list";
  data: MistralBatchJob[];
  total: number;
}

// --- Audio Speech types ---

export interface MistralSpeechRequest {
  model: string;
  input: string;
  voice_id?: string;
  ref_audio?: string;
  response_format?: "pcm" | "wav" | "mp3" | "flac" | "opus";
  speed?: number;
  stream?: boolean;
  language?: string;
}

// --- Audio Transcription types ---

export interface MistralTranscriptionRequest {
  file: Blob;
  model: string;
  language?: string;
  prompt?: string;
  response_format?: "json" | "text" | "srt" | "verbose_json" | "vtt";
  temperature?: number;
  timestamp_granularities?: string[];
}

export interface MistralTranscriptionSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

export interface MistralTranscriptionWord {
  word: string;
  start: number;
  end: number;
}

export interface MistralTranscriptionResponse {
  text: string;
  task?: string;
  language?: string;
  duration?: number;
  segments?: MistralTranscriptionSegment[];
  words?: MistralTranscriptionWord[];
}

// --- Audio Voice types ---

export interface MistralVoice {
  voice_id: string;
  name: string;
  gender?: string;
  languages?: string[];
  age?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  owner?: string;
}

export interface MistralVoiceListResponse {
  data: MistralVoice[];
}

export interface MistralVoiceCreateRequest {
  name: string;
  sample: string;
  gender?: string;
  languages?: string[];
  age?: string;
  tags?: string[];
}

export interface MistralVoiceUpdateRequest {
  name?: string;
  gender?: string;
  languages?: string[];
  age?: string;
  tags?: string[];
}

// --- Agents types ---

export interface MistralAgentHandoff {
  agent_id: string;
}

export interface MistralAgentCreateRequest {
  model: string;
  name?: string;
  description?: string;
  instructions?: string;
  tools?: MistralTool[];
  completion_args?: Record<string, unknown>;
  handoffs?: MistralAgentHandoff[];
}

export interface MistralAgent {
  id: string;
  object: string;
  name?: string;
  description?: string;
  model: string;
  instructions?: string;
  tools?: MistralTool[];
  created_at: string;
  updated_at?: string;
  version?: number;
  completion_args?: Record<string, unknown>;
  handoffs?: MistralAgentHandoff[];
}

export interface MistralAgentListResponse {
  object: "list";
  data: MistralAgent[];
}

export interface MistralAgentUpdateRequest {
  name?: string;
  description?: string;
  model?: string;
  instructions?: string;
  tools?: MistralTool[];
  completion_args?: Record<string, unknown>;
  handoffs?: MistralAgentHandoff[];
}

export interface MistralAgentVersionUpdateRequest {
  instructions?: string;
  tools?: MistralTool[];
  completion_args?: Record<string, unknown>;
  handoffs?: MistralAgentHandoff[];
}

export interface MistralAgentVersion {
  version: number;
  model: string;
  instructions?: string;
  tools?: MistralTool[];
  created_at: string;
  completion_args?: Record<string, unknown>;
  handoffs?: MistralAgentHandoff[];
}

export interface MistralAgentVersionListResponse {
  object: "list";
  data: MistralAgentVersion[];
}

export interface MistralAgentAlias {
  alias: string;
  version: number;
}

export interface MistralAgentAliasCreateRequest {
  alias: string;
  version: number;
}

export interface MistralAgentAliasListResponse {
  object: "list";
  data: MistralAgentAlias[];
}

export interface MistralAgentAliasDeleteRequest {
  alias: string;
}

// --- Agents Completions (deprecated) ---

export interface MistralAgentCompletionRequest {
  agent_id: string;
  messages: MistralMessage[];
  max_tokens?: number;
  stream?: boolean;
}

export interface MistralAgentCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: MistralChatChoice[];
  usage?: MistralUsage;
}

// --- Conversations types ---

export interface MistralConversationCreateRequest {
  agent_id: string;
  inputs: MistralMessage[];
  stream?: boolean;
  store?: boolean;
}

export interface MistralConversationEntry {
  role: string;
  content: string | null;
  tool_calls?: MistralToolCall[];
}

export interface MistralConversation {
  conversation_id: string;
  agent_id: string;
  created_at: string;
  updated_at?: string;
  entries?: MistralConversationEntry[];
}

export interface MistralConversationListParams {
  agent_id?: string;
  page?: number;
  page_size?: number;
  created_after?: string;
}

export interface MistralConversationListResponse {
  object: "list";
  data: MistralConversation[];
}

export interface MistralConversationAppendRequest {
  inputs: MistralMessage[];
  stream?: boolean;
}

export interface MistralConversationHistory {
  messages: MistralConversationEntry[];
}

export interface MistralConversationMessagesResponse {
  messages: MistralConversationEntry[];
}

// --- Libraries types ---

export interface MistralLibrary {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  embedding_model?: string;
  chunking_strategy?: string;
}

export interface MistralLibraryCreateRequest {
  name: string;
  description?: string;
  embedding_model?: string;
  chunking_strategy?: string;
}

export interface MistralLibraryUpdateRequest {
  name?: string;
  description?: string;
}

export interface MistralLibraryListResponse {
  data: MistralLibrary[];
}

// --- Library Access types ---

export interface MistralLibraryAccess {
  user_id: string;
  role: "viewer" | "editor";
}

export interface MistralLibraryAccessListResponse {
  data: MistralLibraryAccess[];
}

export interface MistralLibraryAccessCreateRequest {
  user_id: string;
  role: "viewer" | "editor";
}

export interface MistralLibraryAccessDeleteRequest {
  user_id: string;
}

// --- Library Document types ---

export interface MistralLibraryDocument {
  id: string;
  filename: string;
  created_at: string;
  updated_at?: string;
  status?: string;
  content_type?: string;
  size?: number;
}

export interface MistralLibraryDocumentListParams {
  page?: number;
  page_size?: number;
}

export interface MistralLibraryDocumentListResponse {
  data: MistralLibraryDocument[];
}

export interface MistralLibraryDocumentUpdateRequest {
  filename?: string;
}

export interface MistralLibraryDocumentTextContent {
  text: string;
}

export interface MistralLibraryDocumentStatus {
  status: string;
  progress?: number;
  error?: string;
}

export interface MistralLibraryDocumentSignedUrl {
  url: string;
  expires_at?: string;
}

// --- Namespace interface types ---

export interface MistralChatCompletionsMethod {
  (req: MistralChatRequest, signal?: AbortSignal): Promise<MistralChatResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  moderations: MistralChatModerationsMethod;
  classifications: MistralChatClassificationsMethod;
}

export interface MistralChatModerationsMethod {
  (
    req: MistralChatModerationRequest,
    signal?: AbortSignal
  ): Promise<MistralChatModerationResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralChatClassificationsMethod {
  (
    req: MistralChatClassificationRequest,
    signal?: AbortSignal
  ): Promise<MistralChatClassificationResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralFimCompletionsMethod {
  (req: MistralFimRequest, signal?: AbortSignal): Promise<MistralFimResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralEmbeddingsMethod {
  (
    req: MistralEmbeddingRequest,
    signal?: AbortSignal
  ): Promise<MistralEmbeddingResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralOcrMethod {
  (req: MistralOcrRequest, signal?: AbortSignal): Promise<MistralOcrResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralModerationsMethod {
  (
    req: MistralModerationRequest,
    signal?: AbortSignal
  ): Promise<MistralModerationResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralClassificationsMethod {
  (
    req: MistralClassificationRequest,
    signal?: AbortSignal
  ): Promise<MistralClassificationResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralModelsNamespace {
  list(signal?: AbortSignal): Promise<MistralModelListResponse>;
  retrieve(modelId: string, signal?: AbortSignal): Promise<MistralModel>;
  del(
    modelId: string,
    signal?: AbortSignal
  ): Promise<MistralModelDeleteResponse>;
}

export interface MistralFilesNamespace {
  list(signal?: AbortSignal): Promise<MistralFileListResponse>;
  upload(
    file: Blob,
    filename: string,
    purpose: string,
    signal?: AbortSignal
  ): Promise<MistralFile>;
  retrieve(fileId: string, signal?: AbortSignal): Promise<MistralFile>;
  del(fileId: string, signal?: AbortSignal): Promise<MistralFileDeleteResponse>;
  content(fileId: string, signal?: AbortSignal): Promise<string>;
  url(fileId: string, signal?: AbortSignal): Promise<MistralFileUrlResponse>;
}

export interface MistralFineTuningJobsNamespace {
  (
    req: MistralFineTuningJobCreateRequest,
    signal?: AbortSignal
  ): Promise<MistralFineTuningJob>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  list(
    params?: MistralFineTuningJobListParams,
    signal?: AbortSignal
  ): Promise<MistralFineTuningJobListResponse>;
  retrieve(jobId: string, signal?: AbortSignal): Promise<MistralFineTuningJob>;
  cancel(jobId: string, signal?: AbortSignal): Promise<MistralFineTuningJob>;
  start(jobId: string, signal?: AbortSignal): Promise<MistralFineTuningJob>;
}

export interface MistralFineTuningModelsNamespace {
  update(
    modelId: string,
    req: MistralFineTuningModelUpdateRequest,
    signal?: AbortSignal
  ): Promise<MistralModel>;
  archive(
    modelId: string,
    signal?: AbortSignal
  ): Promise<MistralFineTuningModelArchiveResponse>;
  unarchive(
    modelId: string,
    signal?: AbortSignal
  ): Promise<MistralFineTuningModelArchiveResponse>;
}

export interface MistralFineTuningNamespace {
  jobs: MistralFineTuningJobsNamespace;
  models: MistralFineTuningModelsNamespace;
}

export interface MistralBatchJobsNamespace {
  (
    req: MistralBatchJobCreateRequest,
    signal?: AbortSignal
  ): Promise<MistralBatchJob>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  list(
    params?: MistralBatchJobListParams,
    signal?: AbortSignal
  ): Promise<MistralBatchJobListResponse>;
  retrieve(jobId: string, signal?: AbortSignal): Promise<MistralBatchJob>;
  cancel(jobId: string, signal?: AbortSignal): Promise<MistralBatchJob>;
}

export interface MistralSpeechMethod {
  (req: MistralSpeechRequest, signal?: AbortSignal): Promise<ArrayBuffer>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralTranscriptionsMethod {
  (
    req: MistralTranscriptionRequest,
    signal?: AbortSignal
  ): Promise<MistralTranscriptionResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface MistralVoicesNamespace {
  list(signal?: AbortSignal): Promise<MistralVoiceListResponse>;
  create: {
    (
      req: MistralVoiceCreateRequest,
      signal?: AbortSignal
    ): Promise<MistralVoice>;
    payloadSchema: PayloadSchema;
    validatePayload(data: unknown): ValidationResult;
  };
  retrieve(voiceId: string, signal?: AbortSignal): Promise<MistralVoice>;
  update: {
    (
      voiceId: string,
      req: MistralVoiceUpdateRequest,
      signal?: AbortSignal
    ): Promise<MistralVoice>;
    payloadSchema: PayloadSchema;
    validatePayload(data: unknown): ValidationResult;
  };
  del(voiceId: string, signal?: AbortSignal): Promise<void>;
  sample(voiceId: string, signal?: AbortSignal): Promise<ArrayBuffer>;
}

export interface MistralAudioNamespace {
  speech: MistralSpeechMethod;
  transcriptions: MistralTranscriptionsMethod;
  voices: MistralVoicesNamespace;
}

export interface MistralAgentsNamespace {
  list(signal?: AbortSignal): Promise<MistralAgentListResponse>;
  create: {
    (
      req: MistralAgentCreateRequest,
      signal?: AbortSignal
    ): Promise<MistralAgent>;
    payloadSchema: PayloadSchema;
    validatePayload(data: unknown): ValidationResult;
  };
  retrieve(agentId: string, signal?: AbortSignal): Promise<MistralAgent>;
  update(
    agentId: string,
    req: MistralAgentUpdateRequest,
    signal?: AbortSignal
  ): Promise<MistralAgent>;
  del(agentId: string, signal?: AbortSignal): Promise<void>;
  versions: {
    list(
      agentId: string,
      signal?: AbortSignal
    ): Promise<MistralAgentVersionListResponse>;
    retrieve(
      agentId: string,
      version: number,
      signal?: AbortSignal
    ): Promise<MistralAgentVersion>;
    update(
      agentId: string,
      req: MistralAgentVersionUpdateRequest,
      signal?: AbortSignal
    ): Promise<MistralAgentVersion>;
  };
  aliases: {
    list(
      agentId: string,
      signal?: AbortSignal
    ): Promise<MistralAgentAliasListResponse>;
    create(
      agentId: string,
      req: MistralAgentAliasCreateRequest,
      signal?: AbortSignal
    ): Promise<MistralAgentAlias>;
    del(
      agentId: string,
      req: MistralAgentAliasDeleteRequest,
      signal?: AbortSignal
    ): Promise<void>;
  };
  completions: {
    (
      req: MistralAgentCompletionRequest,
      signal?: AbortSignal
    ): Promise<MistralAgentCompletionResponse>;
    payloadSchema: PayloadSchema;
    validatePayload(data: unknown): ValidationResult;
  };
}

export interface MistralConversationsNamespace {
  list(
    params?: MistralConversationListParams,
    signal?: AbortSignal
  ): Promise<MistralConversationListResponse>;
  create: {
    (
      req: MistralConversationCreateRequest,
      signal?: AbortSignal
    ): Promise<MistralConversation>;
    payloadSchema: PayloadSchema;
    validatePayload(data: unknown): ValidationResult;
  };
  retrieve(
    conversationId: string,
    signal?: AbortSignal
  ): Promise<MistralConversation>;
  del(conversationId: string, signal?: AbortSignal): Promise<void>;
  append: {
    (
      conversationId: string,
      req: MistralConversationAppendRequest,
      signal?: AbortSignal
    ): Promise<MistralConversation>;
    payloadSchema: PayloadSchema;
    validatePayload(data: unknown): ValidationResult;
  };
  history(
    conversationId: string,
    signal?: AbortSignal
  ): Promise<MistralConversationHistory>;
  messages(
    conversationId: string,
    signal?: AbortSignal
  ): Promise<MistralConversationMessagesResponse>;
  restart: {
    (
      conversationId: string,
      signal?: AbortSignal
    ): Promise<MistralConversation>;
    payloadSchema: PayloadSchema;
  };
}

export interface MistralLibrariesNamespace {
  list(signal?: AbortSignal): Promise<MistralLibraryListResponse>;
  create: {
    (
      req: MistralLibraryCreateRequest,
      signal?: AbortSignal
    ): Promise<MistralLibrary>;
    payloadSchema: PayloadSchema;
    validatePayload(data: unknown): ValidationResult;
  };
  retrieve(libraryId: string, signal?: AbortSignal): Promise<MistralLibrary>;
  update(
    libraryId: string,
    req: MistralLibraryUpdateRequest,
    signal?: AbortSignal
  ): Promise<MistralLibrary>;
  del(libraryId: string, signal?: AbortSignal): Promise<void>;
  share: {
    list(
      libraryId: string,
      signal?: AbortSignal
    ): Promise<MistralLibraryAccessListResponse>;
    create(
      libraryId: string,
      req: MistralLibraryAccessCreateRequest,
      signal?: AbortSignal
    ): Promise<MistralLibraryAccess>;
    del(
      libraryId: string,
      req: MistralLibraryAccessDeleteRequest,
      signal?: AbortSignal
    ): Promise<void>;
  };
  documents: {
    list(
      libraryId: string,
      params?: MistralLibraryDocumentListParams,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocumentListResponse>;
    upload(
      libraryId: string,
      file: Blob,
      filename: string,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocument>;
    retrieve(
      libraryId: string,
      documentId: string,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocument>;
    update(
      libraryId: string,
      documentId: string,
      req: MistralLibraryDocumentUpdateRequest,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocument>;
    del(
      libraryId: string,
      documentId: string,
      signal?: AbortSignal
    ): Promise<void>;
    textContent(
      libraryId: string,
      documentId: string,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocumentTextContent>;
    status(
      libraryId: string,
      documentId: string,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocumentStatus>;
    signedUrl(
      libraryId: string,
      documentId: string,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocumentSignedUrl>;
    extractedTextSignedUrl(
      libraryId: string,
      documentId: string,
      signal?: AbortSignal
    ): Promise<MistralLibraryDocumentSignedUrl>;
    reprocess(
      libraryId: string,
      documentId: string,
      signal?: AbortSignal
    ): Promise<void>;
  };
}

export interface MistralV1Namespace {
  chat: {
    completions: MistralChatCompletionsMethod;
  };
  fim: {
    completions: MistralFimCompletionsMethod;
  };
  embeddings: MistralEmbeddingsMethod;
  ocr: MistralOcrMethod;
  moderations: MistralModerationsMethod;
  classifications: MistralClassificationsMethod;
  models: MistralModelsNamespace;
  files: MistralFilesNamespace;
  fine_tuning: MistralFineTuningNamespace;
  batch: {
    jobs: MistralBatchJobsNamespace;
  };
  audio: MistralAudioNamespace;
  agents: MistralAgentsNamespace;
  conversations: MistralConversationsNamespace;
  libraries: MistralLibrariesNamespace;
}

export interface MistralProvider {
  v1: MistralV1Namespace;
}
