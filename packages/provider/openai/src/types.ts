// OpenAI provider options
export interface OpenAiOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

// Content part for vision messages
export interface OpenAiTextPart {
  type: "text";
  text: string;
}

export interface OpenAiImageUrlPart {
  type: "image_url";
  image_url: { url: string; detail?: "auto" | "low" | "high" };
}

export type OpenAiContentPart = OpenAiTextPart | OpenAiImageUrlPart;

// Chat message
export interface OpenAiMessage {
  role: "user" | "assistant" | "system";
  content: string | OpenAiContentPart[];
}

// Speech (text-to-speech) request
export interface OpenAiSpeechRequest {
  model: string;
  input: string;
  voice:
    | "alloy"
    | "ash"
    | "coral"
    | "echo"
    | "fable"
    | "onyx"
    | "nova"
    | "sage"
    | "shimmer";
  response_format?: "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm";
  speed?: number;
  instructions?: string;
}

// Transcription request
export interface OpenAiTranscribeRequest {
  file: Blob;
  model: string;
  response_format?: string;
  language?: string;
  prompt?: string;
  temperature?: number;
}

// Transcription response
export interface OpenAiTranscribeResponse {
  text: string;
}

// Translation request
export interface OpenAiTranslateRequest {
  file: Blob;
  model: string;
  response_format?: string;
  prompt?: string;
  temperature?: number;
}

// Translation response
export interface OpenAiTranslateResponse {
  text: string;
}

// Tool function definition
export interface OpenAiToolFunction {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

// Tool definition
export interface OpenAiTool {
  type: "function";
  function: OpenAiToolFunction;
}

// Tool call in response
export interface OpenAiToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

// Usage info (raw API shape)
export interface OpenAiUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Chat request
export interface OpenAiChatRequest {
  model?: string;
  messages: OpenAiMessage[];
  temperature?: number;
  max_tokens?: number;
  max_completion_tokens?: number;
  tools?: OpenAiTool[];
  tool_choice?:
    | "auto"
    | "none"
    | { type: "function"; function: { name: string } };
  response_format?: {
    type: "text" | "json_object" | "json_schema";
    json_schema?: Record<string, unknown>;
  };
  store?: boolean;
  metadata?: Record<string, string>;
}

// Chat response (raw API shape)
export interface OpenAiChatChoice {
  index: number;
  message: {
    role: string;
    content: string | null;
    tool_calls?: OpenAiToolCall[];
  };
  finish_reason: string;
}

export interface OpenAiChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAiChatChoice[];
  usage?: OpenAiUsage;
  metadata?: Record<string, string>;
  error?: { message?: string; type?: string };
}

// --- Stored Chat Completions API types ---

// List stored completions options
export interface OpenAiStoredCompletionListOptions {
  after?: string;
  limit?: number;
  order?: "asc" | "desc";
  metadata?: Record<string, string>;
}

// List stored completions response
export interface OpenAiStoredCompletionListResponse {
  object: "list";
  data: OpenAiChatResponse[];
  has_more: boolean;
  first_id: string;
  last_id: string;
}

// Delete stored completion response
export interface OpenAiStoredCompletionDeleteResponse {
  id: string;
  object: "chat.completion.deleted";
  deleted: true;
}

// Update stored completion request
export interface OpenAiStoredCompletionUpdateRequest {
  metadata: Record<string, string>;
}

// Stored completion message
export interface OpenAiStoredCompletionMessage {
  id: string;
  role: string;
  content: string | null;
  refusal?: string | null;
  function_call?: Record<string, unknown> | null;
  tool_calls?: OpenAiToolCall[] | null;
}

// List stored completion messages options
export interface OpenAiStoredCompletionMessageListOptions {
  after?: string;
  limit?: number;
  order?: "asc" | "desc";
}

// List stored completion messages response
export interface OpenAiStoredCompletionMessageListResponse {
  object: "list";
  data: OpenAiStoredCompletionMessage[];
  has_more: boolean;
  first_id: string;
  last_id: string;
}

// Embeddings request
export interface OpenAiEmbeddingRequest {
  input: string | string[] | number[] | number[][];
  model: string;
  encoding_format?: "float" | "base64";
  dimensions?: number;
  user?: string;
}

// Embeddings response
export interface OpenAiEmbeddingData {
  object: "embedding";
  index: number;
  embedding: number[];
}

export interface OpenAiEmbeddingUsage {
  prompt_tokens: number;
  total_tokens: number;
}

export interface OpenAiEmbeddingResponse {
  object: "list";
  data: OpenAiEmbeddingData[];
  model: string;
  usage: OpenAiEmbeddingUsage;
}

// Image edit request
export interface OpenAiImageEditRequest {
  image: Blob | Blob[];
  prompt: string;
  mask?: Blob;
  model?: string;
  n?: number;
  size?:
    | "256x256"
    | "512x512"
    | "1024x1024"
    | "1536x1024"
    | "1024x1536"
    | "auto";
  quality?: "standard" | "low" | "medium" | "high" | "auto";
  output_format?: "png" | "jpeg" | "webp";
  response_format?: "url" | "b64_json";
  background?: "transparent" | "opaque" | "auto";
  input_fidelity?: "high" | "low";
  output_compression?: number;
  user?: string;
}

// Image edit response
export interface OpenAiImageData {
  b64_json?: string | null;
  revised_prompt?: string | null;
  url?: string | null;
}

export interface OpenAiImageEditUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_tokens_details?: {
    image_tokens: number;
    text_tokens: number;
  };
  output_tokens_details?: {
    image_tokens: number;
    text_tokens: number;
  };
}

export interface OpenAiImageEditResponse {
  created: number;
  data?: OpenAiImageData[];
  background?: "transparent" | "opaque" | null;
  output_format?: "png" | "webp" | "jpeg" | null;
  quality?: "low" | "medium" | "high" | null;
  size?: string | null;
  usage?: OpenAiImageEditUsage | null;
}

// Image generation request
export interface OpenAiImageGenerationRequest {
  prompt: string;
  model?: string;
  n?: number;
  size?: string;
  quality?: string;
  response_format?: "url" | "b64_json";
  style?: "vivid" | "natural";
  background?: "transparent" | "opaque" | "auto";
  moderation?: "low" | "auto";
  output_format?: "png" | "jpeg" | "webp";
  output_compression?: number;
  user?: string;
}

// Image generation response
export interface OpenAiGeneratedImage {
  b64_json?: string;
  url?: string;
  revised_prompt?: string;
}

export interface OpenAiImageGenerationUsage {
  input_tokens: number;
  input_tokens_details: {
    image_tokens: number;
    text_tokens: number;
  };
  output_tokens: number;
  total_tokens: number;
}

export interface OpenAiImageGenerationResponse {
  created: number;
  data: OpenAiGeneratedImage[];
  usage?: OpenAiImageGenerationUsage;
}

// --- Responses API types ---

// Input content parts
export interface OpenAiResponseInputTextContent {
  type: "input_text";
  text: string;
}

export interface OpenAiResponseInputImageContent {
  type: "input_image";
  image_url?: string;
  file_id?: string;
  detail?: "auto" | "low" | "high";
}

export interface OpenAiResponseInputAudioContent {
  type: "input_audio";
  data: string;
  format: "wav" | "mp3";
}

export type OpenAiResponseInputContent =
  | OpenAiResponseInputTextContent
  | OpenAiResponseInputImageContent
  | OpenAiResponseInputAudioContent;

// Input items
export interface OpenAiResponseInputMessage {
  role: "user" | "assistant" | "system" | "developer";
  content: string | OpenAiResponseInputContent[];
}

export interface OpenAiResponseFunctionCallOutput {
  type: "function_call_output";
  call_id: string;
  output: string;
}

export interface OpenAiResponseItemReference {
  type: "item_reference";
  id: string;
}

export type OpenAiResponseInputItem =
  | OpenAiResponseInputMessage
  | OpenAiResponseFunctionCallOutput
  | OpenAiResponseItemReference;

// Tools for Responses API
export interface OpenAiResponseFunctionTool {
  type: "function";
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
  strict?: boolean;
}

export interface OpenAiResponseWebSearchTool {
  type: "web_search_preview" | "web_search_preview_2025_03_11";
  search_context_size?: "low" | "medium" | "high";
  user_location?: {
    type: "approximate";
    city?: string;
    state?: string;
    country?: string;
    timezone?: string;
  };
}

export interface OpenAiResponseFileSearchTool {
  type: "file_search";
  vector_store_ids: string[];
  max_num_results?: number;
  ranking_options?: {
    ranker?: string;
    score_threshold?: number;
  };
}

export interface OpenAiResponseCodeInterpreterTool {
  type: "code_interpreter";
}

export type OpenAiResponseTool =
  | OpenAiResponseFunctionTool
  | OpenAiResponseWebSearchTool
  | OpenAiResponseFileSearchTool
  | OpenAiResponseCodeInterpreterTool;

// Text format for structured output
export interface OpenAiResponseTextFormat {
  format:
    | { type: "text" }
    | { type: "json_object" }
    | {
        type: "json_schema";
        name: string;
        schema: Record<string, unknown>;
        description?: string;
        strict?: boolean;
      };
}

// Reasoning config
export interface OpenAiResponseReasoning {
  effort?: "low" | "medium" | "high";
  summary?: "auto" | "concise" | "detailed" | null;
}

// Responses API GET options
export interface OpenAiResponseGetOptions {
  include?: string[];
  stream?: boolean;
}

// Responses API request
export interface OpenAiResponseRequest {
  model: string;
  input: string | OpenAiResponseInputItem[];
  instructions?: string;
  temperature?: number;
  max_output_tokens?: number;
  top_p?: number;
  tools?: OpenAiResponseTool[];
  tool_choice?: "auto" | "none" | "required" | { type: string; name?: string };
  previous_response_id?: string;
  store?: boolean;
  metadata?: Record<string, string>;
  stream?: boolean;
  text?: OpenAiResponseTextFormat;
  truncation?: "auto" | "disabled";
  reasoning?: OpenAiResponseReasoning;
  user?: string;
  include?: string[];
  parallel_tool_calls?: boolean;
}

// Output content types
export interface OpenAiResponseAnnotation {
  type: "url_citation" | "file_citation" | "file_path";
  start_index: number;
  end_index: number;
  url?: string;
  title?: string;
  file_id?: string;
  filename?: string;
}

export interface OpenAiResponseOutputText {
  type: "output_text";
  text: string;
  annotations?: OpenAiResponseAnnotation[];
}

export interface OpenAiResponseRefusal {
  type: "refusal";
  refusal: string;
}

export type OpenAiResponseOutputContent =
  | OpenAiResponseOutputText
  | OpenAiResponseRefusal;

// Output items
export interface OpenAiResponseOutputMessage {
  type: "message";
  id: string;
  role: "assistant";
  content: OpenAiResponseOutputContent[];
  status: "in_progress" | "completed" | "incomplete";
}

export interface OpenAiResponseFunctionCallItem {
  type: "function_call";
  id: string;
  call_id: string;
  name: string;
  arguments: string;
  status: "in_progress" | "completed" | "incomplete";
}

export interface OpenAiResponseWebSearchCallItem {
  type: "web_search_call";
  id: string;
  status: "completed";
}

export interface OpenAiResponseFileSearchCallItem {
  type: "file_search_call";
  id: string;
  status: "completed";
  results?: OpenAiResponseFileSearchResult[];
}

export interface OpenAiResponseFileSearchResult {
  file_id: string;
  filename: string;
  score: number;
  text: string;
}

export type OpenAiResponseOutputItem =
  | OpenAiResponseOutputMessage
  | OpenAiResponseFunctionCallItem
  | OpenAiResponseWebSearchCallItem
  | OpenAiResponseFileSearchCallItem;

// Responses API usage
export interface OpenAiResponseUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_tokens_details?: {
    cached_tokens: number;
  };
  output_tokens_details?: {
    reasoning_tokens: number;
  };
}

// Responses API delete response
export interface OpenAiResponseDeleteResponse {
  id: string;
  object: "response.deleted";
  deleted: true;
}

// Responses API response
export interface OpenAiResponseResponse {
  id: string;
  object: "response";
  created_at: number;
  status:
    | "completed"
    | "failed"
    | "in_progress"
    | "incomplete"
    | "cancelled"
    | "queued";
  model: string;
  output: OpenAiResponseOutputItem[];
  usage?: OpenAiResponseUsage;
  error?: {
    code: string;
    message: string;
  } | null;
  incomplete_details?: {
    reason: string;
  } | null;
  instructions?: string | null;
  metadata?: Record<string, string>;
  temperature?: number | null;
  top_p?: number | null;
  max_output_tokens?: number | null;
  previous_response_id?: string | null;
  reasoning?: OpenAiResponseReasoning | null;
  text?: OpenAiResponseTextFormat;
  tool_choice?: "auto" | "none" | "required" | { type: string; name?: string };
  tools?: OpenAiResponseTool[];
  truncation?: "auto" | "disabled";
  parallel_tool_calls?: boolean;
}

// Responses API input_items list options
export interface OpenAiResponseInputItemsOptions {
  after?: string;
  limit?: number;
  order?: "asc" | "desc";
  include?: string[];
}

// Responses API input_items list response
export interface OpenAiResponseInputItemsResponse {
  object: "list";
  data: (OpenAiResponseInputItem | OpenAiResponseOutputItem)[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

// Responses API compact request
export interface OpenAiResponseCompactRequest {
  model: string;
  input?: string | OpenAiResponseInputItem[] | null;
  instructions?: string | null;
  previous_response_id?: string | null;
  prompt_cache_key?: string | null;
}

// Responses API compact response
export interface OpenAiResponseCompactResponse {
  id: string;
  object: "response.compaction";
  created_at: number;
  output: (OpenAiResponseInputItem | OpenAiResponseOutputItem)[];
  usage?: OpenAiResponseUsage;
}

// Responses API input_tokens request
export interface OpenAiResponseInputTokensRequest {
  model?: string | null;
  input?: string | OpenAiResponseInputItem[] | null;
  instructions?: string | null;
  conversation?: string | Record<string, unknown> | null;
  previous_response_id?: string | null;
  tools?: OpenAiResponseTool[] | null;
  tool_choice?:
    | "auto"
    | "none"
    | "required"
    | { type: string; name?: string }
    | null;
  parallel_tool_calls?: boolean | null;
  reasoning?: OpenAiResponseReasoning | null;
  text?: OpenAiResponseTextFormat | null;
  truncation?: "auto" | "disabled";
}

// Responses API input_tokens response
export interface OpenAiResponseInputTokensResponse {
  object: "response.input_tokens";
  input_tokens: number;
}

// --- Conversations API types ---

// Conversation object
export interface OpenAiConversation {
  id: string;
  object: "conversation";
  created_at: number;
  metadata: Record<string, string> | null;
}

// Conversation deleted response
export interface OpenAiConversationDeleteResponse {
  id: string;
  object: "conversation.deleted";
  deleted: boolean;
}

// Create conversation request
export interface OpenAiConversationCreateRequest {
  items?: OpenAiResponseInputItem[] | null;
  metadata?: Record<string, string> | null;
}

// Update conversation request
export interface OpenAiConversationUpdateRequest {
  metadata: Record<string, string> | null;
}

// Conversation item (same shape as response output items)
export interface OpenAiConversationItem {
  id: string;
  type: string;
  [key: string]: unknown;
}

// Create conversation items request
export interface OpenAiConversationItemsCreateRequest {
  items: OpenAiResponseInputItem[];
  include?: string[];
}

// Conversation item list response
export interface OpenAiConversationItemListResponse {
  object: "list";
  data: OpenAiConversationItem[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

// List conversation items options
export interface OpenAiConversationItemListOptions {
  after?: string;
  limit?: number;
  order?: "asc" | "desc";
  include?: string[];
}

// Retrieve conversation item options
export interface OpenAiConversationItemRetrieveOptions {
  include?: string[];
}

// --- Realtime REST API types ---

// Realtime session create request
export interface OpenAiRealtimeSessionCreateRequest {
  model?: string;
  modalities?: string[];
  instructions?: string;
  voice?: string;
  input_audio_format?: string;
  output_audio_format?: string;
  input_audio_transcription?: Record<string, unknown> | null;
  turn_detection?: Record<string, unknown> | null;
  tools?: Record<string, unknown>[];
  tool_choice?: string;
  temperature?: number;
  max_response_output_tokens?: number | "inf";
}

// Realtime session create response
export interface OpenAiRealtimeSessionCreateResponse {
  id: string;
  object: "realtime.session";
  model: string;
  modalities: string[];
  instructions: string;
  voice: string;
  input_audio_format: string;
  output_audio_format: string;
  input_audio_transcription: Record<string, unknown> | null;
  turn_detection: Record<string, unknown> | null;
  tools: Record<string, unknown>[];
  tool_choice: string;
  temperature: number;
  max_response_output_tokens: number | "inf";
  client_secret: {
    value: string;
    expires_at: number;
  };
}

// Realtime transcription session create request
export interface OpenAiRealtimeTranscriptionSessionCreateRequest {
  input_audio_format?: string;
  input_audio_transcription?: Record<string, unknown> | null;
  turn_detection?: Record<string, unknown> | null;
  include?: string[];
}

// Realtime transcription session create response
export interface OpenAiRealtimeTranscriptionSessionCreateResponse {
  id: string;
  object: "realtime.transcription_session";
  modalities: string[];
  turn_detection: Record<string, unknown> | null;
  input_audio_format: string;
  input_audio_transcription: Record<string, unknown> | null;
  client_secret: {
    value: string;
    expires_at: number;
  } | null;
}

// Realtime client secret create request
export interface OpenAiRealtimeClientSecretCreateRequest {
  expires_after?: {
    anchor?: "created_at";
    seconds?: number;
  };
  session?:
    | OpenAiRealtimeSessionCreateRequest
    | OpenAiRealtimeTranscriptionSessionCreateRequest;
}

// Realtime client secret create response
export interface OpenAiRealtimeClientSecretCreateResponse {
  value: string;
  expires_at: number;
  session: Record<string, unknown>;
}

// Realtime call accept request
export interface OpenAiRealtimeCallAcceptRequest {
  type: "realtime";
  model?: string;
  instructions?: string;
  modalities?: string[];
  voice?: string;
  max_output_tokens?: number | "inf";
  tools?: Record<string, unknown>[];
  tool_choice?: string;
  audio?: Record<string, unknown>;
  include?: string[];
  tracing?: Record<string, unknown> | "auto" | null;
  truncation?: Record<string, unknown>;
  prompt?: Record<string, unknown> | null;
}

// Realtime call refer request
export interface OpenAiRealtimeCallReferRequest {
  target_uri: string;
}

// Realtime call reject request
export interface OpenAiRealtimeCallRejectRequest {
  status_code?: number;
}

// --- Evals API types ---

// Eval object (response shape for create/retrieve/update/list)
export interface OpenAiEval {
  id: string;
  object: "eval";
  created_at: number;
  name: string;
  data_source_config: Record<string, unknown>;
  testing_criteria: Record<string, unknown>[];
  metadata: Record<string, string> | null;
}

// Eval delete response
export interface OpenAiEvalDeleteResponse {
  object: string;
  eval_id: string;
  deleted: boolean;
}

// Eval create request
export interface OpenAiEvalCreateRequest {
  data_source_config: Record<string, unknown>;
  testing_criteria: Record<string, unknown>[];
  metadata?: Record<string, string> | null;
  name?: string;
}

// Eval update request
export interface OpenAiEvalUpdateRequest {
  metadata?: Record<string, string> | null;
  name?: string;
}

// Eval list options
export interface OpenAiEvalListOptions {
  after?: string;
  limit?: number;
  order?: "asc" | "desc";
  order_by?: "created_at" | "updated_at";
}

// Eval list response
export interface OpenAiEvalListResponse {
  object: "list";
  data: OpenAiEval[];
  has_more: boolean;
  first_id: string;
  last_id: string;
}

// Eval run object
export interface OpenAiEvalRun {
  id: string;
  object: "eval.run";
  eval_id: string;
  created_at: number;
  status: string;
  model: string;
  name: string;
  data_source: Record<string, unknown>;
  error: Record<string, unknown> | null;
  metadata: Record<string, string> | null;
  per_model_usage: Record<string, unknown>[];
  per_testing_criteria_results: Record<string, unknown>[];
  report_url: string;
  result_counts: Record<string, unknown>;
}

// Eval run create request
export interface OpenAiEvalRunCreateRequest {
  data_source: Record<string, unknown>;
  metadata?: Record<string, string> | null;
  name?: string;
}

// Eval run delete response
export interface OpenAiEvalRunDeleteResponse {
  object: string;
  run_id: string;
  deleted: boolean;
}

// Eval run list options
export interface OpenAiEvalRunListOptions {
  after?: string;
  limit?: number;
  order?: "asc" | "desc";
  status?: string;
}

// Eval run list response
export interface OpenAiEvalRunListResponse {
  object: "list";
  data: OpenAiEvalRun[];
  has_more: boolean;
  first_id: string;
  last_id: string;
}

// Eval run output item
export interface OpenAiEvalRunOutputItem {
  id: string;
  object: "eval.run.output_item";
  run_id: string;
  eval_id: string;
  created_at: number;
  status: string;
  datasource_item: Record<string, unknown>;
  datasource_item_id: number;
  results: Record<string, unknown>[];
  sample: Record<string, unknown>;
}

// Eval run output item list options
export interface OpenAiEvalRunOutputItemListOptions {
  after?: string;
  limit?: number;
  order?: "asc" | "desc";
  status?: string;
}

// Eval run output item list response
export interface OpenAiEvalRunOutputItemListResponse {
  object: "list";
  data: OpenAiEvalRunOutputItem[];
  has_more: boolean;
  first_id: string;
  last_id: string;
}

// --- Fine-Tuning API types ---

// Fine-tuning job error
export interface OpenAiFineTuningJobError {
  code: string;
  message: string;
  param: string | null;
}

// Fine-tuning hyperparameters
export interface OpenAiFineTuningHyperparameters {
  batch_size?: "auto" | number | null;
  learning_rate_multiplier?: "auto" | number | null;
  n_epochs?: "auto" | number | null;
}

// Fine-tuning method types
export interface OpenAiFineTuningSupervisedHyperparameters {
  batch_size?: "auto" | number;
  learning_rate_multiplier?: "auto" | number;
  n_epochs?: "auto" | number;
}

export interface OpenAiFineTuningSupervisedMethod {
  hyperparameters?: OpenAiFineTuningSupervisedHyperparameters;
}

export interface OpenAiFineTuningDpoHyperparameters {
  batch_size?: "auto" | number;
  beta?: "auto" | number;
  learning_rate_multiplier?: "auto" | number;
  n_epochs?: "auto" | number;
}

export interface OpenAiFineTuningDpoMethod {
  hyperparameters?: OpenAiFineTuningDpoHyperparameters;
}

export interface OpenAiFineTuningReinforcementHyperparameters {
  batch_size?: "auto" | number;
  compute_multiplier?: "auto" | number;
  eval_interval?: "auto" | number;
  eval_samples?: "auto" | number;
  learning_rate_multiplier?: "auto" | number;
  n_epochs?: "auto" | number;
  reasoning_effort?: "default" | "low" | "medium" | "high";
}

export interface OpenAiFineTuningReinforcementMethod {
  grader: Record<string, unknown>;
  hyperparameters?: OpenAiFineTuningReinforcementHyperparameters;
}

export interface OpenAiFineTuningMethod {
  type: "supervised" | "dpo" | "reinforcement";
  supervised?: OpenAiFineTuningSupervisedMethod | null;
  dpo?: OpenAiFineTuningDpoMethod | null;
  reinforcement?: OpenAiFineTuningReinforcementMethod | null;
}

// Fine-tuning WandB integration
export interface OpenAiFineTuningWandbConfig {
  project: string;
  entity?: string | null;
  name?: string | null;
  tags?: string[];
}

export interface OpenAiFineTuningIntegration {
  type: "wandb";
  wandb: OpenAiFineTuningWandbConfig;
}

// Fine-tuning job object (response)
export interface OpenAiFineTuningJob {
  id: string;
  object: "fine_tuning.job";
  created_at: number;
  error: OpenAiFineTuningJobError | null;
  fine_tuned_model: string | null;
  finished_at: number | null;
  hyperparameters: OpenAiFineTuningHyperparameters;
  model: string;
  organization_id: string;
  result_files: string[];
  seed: number;
  status:
    | "validating_files"
    | "queued"
    | "running"
    | "succeeded"
    | "failed"
    | "cancelled";
  trained_tokens: number | null;
  training_file: string;
  validation_file: string | null;
  estimated_finish: number | null;
  integrations: OpenAiFineTuningIntegration[] | null;
  metadata: Record<string, string> | null;
  method: OpenAiFineTuningMethod | null;
}

// Create fine-tuning job request
export interface OpenAiFineTuningJobCreateRequest {
  model: string;
  training_file: string;
  hyperparameters?: OpenAiFineTuningHyperparameters;
  integrations?: OpenAiFineTuningIntegration[] | null;
  metadata?: Record<string, string> | null;
  method?: OpenAiFineTuningMethod;
  seed?: number | null;
  suffix?: string | null;
  validation_file?: string | null;
}

// List fine-tuning jobs options
export interface OpenAiFineTuningJobListOptions {
  after?: string;
  limit?: number;
  metadata?: Record<string, string>;
}

// List fine-tuning jobs response
export interface OpenAiFineTuningJobListResponse {
  object: "list";
  data: OpenAiFineTuningJob[];
  has_more: boolean;
}

// Fine-tuning job event
export interface OpenAiFineTuningJobEvent {
  id: string;
  object: "fine_tuning.job.event";
  created_at: number;
  level: "info" | "warn" | "error";
  message: string;
  data: Record<string, unknown> | null;
  type: "message" | "metrics" | null;
}

// List events options
export interface OpenAiFineTuningJobEventListOptions {
  after?: string;
  limit?: number;
}

// List events response
export interface OpenAiFineTuningJobEventListResponse {
  object: "list";
  data: OpenAiFineTuningJobEvent[];
  has_more: boolean;
}

// Fine-tuning job checkpoint metrics
export interface OpenAiFineTuningCheckpointMetrics {
  full_valid_loss?: number | null;
  full_valid_mean_token_accuracy?: number | null;
  step?: number | null;
  train_loss?: number | null;
  train_mean_token_accuracy?: number | null;
  valid_loss?: number | null;
  valid_mean_token_accuracy?: number | null;
}

// Fine-tuning job checkpoint
export interface OpenAiFineTuningJobCheckpoint {
  id: string;
  object: "fine_tuning.job.checkpoint";
  created_at: number;
  fine_tuned_model_checkpoint: string;
  fine_tuning_job_id: string;
  metrics: OpenAiFineTuningCheckpointMetrics;
  step_number: number;
}

// List checkpoints options
export interface OpenAiFineTuningJobCheckpointListOptions {
  after?: string;
  limit?: number;
}

// List checkpoints response
export interface OpenAiFineTuningJobCheckpointListResponse {
  object: "list";
  data: OpenAiFineTuningJobCheckpoint[];
  has_more: boolean;
}

// Checkpoint permission
export interface OpenAiCheckpointPermission {
  id: string;
  object: "checkpoint.permission";
  created_at: number;
  project_id: string;
}

// Create checkpoint permissions request
export interface OpenAiCheckpointPermissionCreateRequest {
  project_ids: string[];
}

// Create checkpoint permissions response
export interface OpenAiCheckpointPermissionCreateResponse {
  object: "list";
  data: OpenAiCheckpointPermission[];
}

// List checkpoint permissions options
export interface OpenAiCheckpointPermissionListOptions {
  after?: string;
  limit?: number;
  order?: "ascending" | "descending";
  project_id?: string;
}

// List checkpoint permissions response
export interface OpenAiCheckpointPermissionListResponse {
  object: "list";
  data: OpenAiCheckpointPermission[];
  has_more: boolean;
  first_id: string | null;
  last_id: string | null;
}

// Delete checkpoint permission response
export interface OpenAiCheckpointPermissionDeleteResponse {
  id: string;
  object: "checkpoint.permission";
  deleted: boolean;
}

// Models API types
export interface OpenAiModel {
  id: string;
  object: "model";
  created: number;
  owned_by: string;
}

export interface OpenAiModelListResponse {
  object: "list";
  data: OpenAiModel[];
}

export interface OpenAiModelDeleteResponse {
  id: string;
  object: "model";
  deleted: boolean;
}

// Moderation input types
export interface OpenAiModerationTextInput {
  type: "text";
  text: string;
}

export interface OpenAiModerationImageUrlInput {
  type: "image_url";
  image_url: { url: string };
}

export type OpenAiModerationMultiModalInput =
  | OpenAiModerationTextInput
  | OpenAiModerationImageUrlInput;

// Moderation request
export interface OpenAiModerationRequest {
  input: string | string[] | OpenAiModerationMultiModalInput[];
  model?: string;
}

// Moderation response
export interface OpenAiModerationCategories {
  harassment: boolean;
  "harassment/threatening": boolean;
  hate: boolean;
  "hate/threatening": boolean;
  illicit: boolean | null;
  "illicit/violent": boolean | null;
  "self-harm": boolean;
  "self-harm/instructions": boolean;
  "self-harm/intent": boolean;
  sexual: boolean;
  "sexual/minors": boolean;
  violence: boolean;
  "violence/graphic": boolean;
}

export interface OpenAiModerationCategoryScores {
  harassment: number;
  "harassment/threatening": number;
  hate: number;
  "hate/threatening": number;
  illicit: number;
  "illicit/violent": number;
  "self-harm": number;
  "self-harm/instructions": number;
  "self-harm/intent": number;
  sexual: number;
  "sexual/minors": number;
  violence: number;
  "violence/graphic": number;
}

export interface OpenAiModerationCategoryAppliedInputTypes {
  harassment: ("text" | "image")[];
  "harassment/threatening": ("text" | "image")[];
  hate: ("text" | "image")[];
  "hate/threatening": ("text" | "image")[];
  illicit: ("text" | "image")[];
  "illicit/violent": ("text" | "image")[];
  "self-harm": ("text" | "image")[];
  "self-harm/instructions": ("text" | "image")[];
  "self-harm/intent": ("text" | "image")[];
  sexual: ("text" | "image")[];
  "sexual/minors": ("text" | "image")[];
  violence: ("text" | "image")[];
  "violence/graphic": ("text" | "image")[];
}

export interface OpenAiModerationResult {
  flagged: boolean;
  categories: OpenAiModerationCategories;
  category_scores: OpenAiModerationCategoryScores;
  category_applied_input_types: OpenAiModerationCategoryAppliedInputTypes;
}

export interface OpenAiModerationResponse {
  id: string;
  model: string;
  results: OpenAiModerationResult[];
}

// --- Batches API types ---

// Batch request counts
export interface OpenAiBatchRequestCounts {
  total: number;
  completed: number;
  failed: number;
}

// Batch errors
export interface OpenAiBatchError {
  code: string;
  message: string;
  param?: string | null;
  line?: number | null;
}

export interface OpenAiBatchErrors {
  object: "list";
  data: OpenAiBatchError[];
}

// Batch create request
export interface OpenAiBatchCreateRequest {
  input_file_id: string;
  endpoint: string;
  completion_window: string;
  metadata?: Record<string, string> | null;
}

// Batch list query params
export interface OpenAiBatchListParams {
  after?: string;
  limit?: number;
}

// Batch object
export interface OpenAiBatch {
  id: string;
  object: "batch";
  endpoint: string;
  errors?: OpenAiBatchErrors | null;
  input_file_id: string;
  completion_window: string;
  status:
    | "validating"
    | "failed"
    | "in_progress"
    | "finalizing"
    | "completed"
    | "expired"
    | "cancelling"
    | "cancelled";
  output_file_id?: string | null;
  error_file_id?: string | null;
  created_at: number;
  in_progress_at?: number | null;
  expires_at?: number | null;
  finalizing_at?: number | null;
  completed_at?: number | null;
  failed_at?: number | null;
  expired_at?: number | null;
  cancelling_at?: number | null;
  cancelled_at?: number | null;
  request_counts?: OpenAiBatchRequestCounts;
  metadata?: Record<string, string> | null;
}

// Batch list response
export interface OpenAiBatchListResponse {
  object: "list";
  data: OpenAiBatch[];
  has_more: boolean;
  first_id?: string;
  last_id?: string;
}

// Files API types
export interface OpenAiFile {
  id: string;
  object: "file";
  bytes: number;
  created_at: number;
  expires_at?: number;
  filename: string;
  purpose:
    | "assistants"
    | "assistants_output"
    | "batch"
    | "batch_output"
    | "fine-tune"
    | "fine-tune-results"
    | "vision"
    | "user_data";
  status: "uploaded" | "processed" | "error";
  status_details?: string;
}

export interface OpenAiFileListRequest {
  purpose?: string;
  limit?: number;
  order?: "asc" | "desc";
  after?: string;
}

export interface OpenAiFileListResponse {
  object: "list";
  data: OpenAiFile[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

export interface OpenAiFileUploadRequest {
  file: Blob;
  purpose:
    | "assistants"
    | "batch"
    | "fine-tune"
    | "vision"
    | "user_data"
    | "evals";
  expires_after?: {
    anchor: "created_at";
    seconds: number;
  };
}

export interface OpenAiFileDeleteResponse {
  id: string;
  object: "file";
  deleted: boolean;
}

// --- Vector Stores API types ---

// Vector store expiration policy
export interface OpenAiVectorStoreExpirationAfter {
  anchor: "last_active_at";
  days: number;
}

// Vector store file counts
export interface OpenAiVectorStoreFileCounts {
  in_progress: number;
  completed: number;
  failed: number;
  cancelled: number;
  total: number;
}

// Vector store object
export interface OpenAiVectorStore {
  id: string;
  object: "vector_store";
  created_at: number;
  name: string;
  usage_bytes: number;
  file_counts: OpenAiVectorStoreFileCounts;
  status: "expired" | "in_progress" | "completed";
  expires_after?: OpenAiVectorStoreExpirationAfter;
  expires_at?: number | null;
  last_active_at: number | null;
  metadata: Record<string, string> | null;
}

// Static chunking strategy
export interface OpenAiStaticChunkingStrategy {
  max_chunk_size_tokens: number;
  chunk_overlap_tokens: number;
}

// Chunking strategy for requests
export type OpenAiChunkingStrategyRequest =
  | { type: "auto" }
  | { type: "static"; static: OpenAiStaticChunkingStrategy };

// Chunking strategy in responses
export type OpenAiChunkingStrategyResponse =
  | { type: "static"; static: OpenAiStaticChunkingStrategy }
  | { type: "other" };

// File attributes (string, number, or boolean values)
export type OpenAiVectorStoreFileAttributes = Record<
  string,
  string | number | boolean
> | null;

// Create vector store request
export interface OpenAiVectorStoreCreateRequest {
  file_ids?: string[];
  name?: string;
  description?: string;
  expires_after?: OpenAiVectorStoreExpirationAfter;
  chunking_strategy?: OpenAiChunkingStrategyRequest;
  metadata?: Record<string, string> | null;
}

// Update vector store request
export interface OpenAiVectorStoreUpdateRequest {
  name?: string | null;
  expires_after?: OpenAiVectorStoreExpirationAfter | null;
  metadata?: Record<string, string> | null;
}

// List vector stores options
export interface OpenAiVectorStoreListOptions {
  limit?: number;
  order?: "asc" | "desc";
  after?: string;
  before?: string;
}

// List vector stores response
export interface OpenAiVectorStoreListResponse {
  object: "list";
  data: OpenAiVectorStore[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

// Delete vector store response
export interface OpenAiVectorStoreDeleteResponse {
  id: string;
  object: "vector_store.deleted";
  deleted: boolean;
}

// Search filter types
export interface OpenAiVectorStoreComparisonFilter {
  type: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "nin";
  key: string;
  value: string | number | boolean | (string | number)[];
}

export interface OpenAiVectorStoreCompoundFilter {
  type: "and" | "or";
  filters: (
    | OpenAiVectorStoreComparisonFilter
    | OpenAiVectorStoreCompoundFilter
  )[];
}

export type OpenAiVectorStoreSearchFilter =
  | OpenAiVectorStoreComparisonFilter
  | OpenAiVectorStoreCompoundFilter;

// Search ranking options
export interface OpenAiVectorStoreSearchRankingOptions {
  ranker?: "none" | "auto" | "default-2024-11-15";
  score_threshold?: number;
}

// Search vector store request
export interface OpenAiVectorStoreSearchRequest {
  query: string | string[];
  rewrite_query?: boolean;
  max_num_results?: number;
  filters?: OpenAiVectorStoreSearchFilter;
  ranking_options?: OpenAiVectorStoreSearchRankingOptions;
}

// Search result content
export interface OpenAiVectorStoreSearchResultContent {
  type: "text";
  text: string;
}

// Search result item
export interface OpenAiVectorStoreSearchResultItem {
  file_id: string;
  filename: string;
  score: number;
  attributes: OpenAiVectorStoreFileAttributes;
  content: OpenAiVectorStoreSearchResultContent[];
}

// Search response
export interface OpenAiVectorStoreSearchResponse {
  object: "vector_store.search_results.page";
  search_query: string[];
  data: OpenAiVectorStoreSearchResultItem[];
  has_more: boolean;
  next_page: string | null;
}

// Vector store file object
export interface OpenAiVectorStoreFile {
  id: string;
  object: "vector_store.file";
  usage_bytes: number;
  created_at: number;
  vector_store_id: string;
  status: "in_progress" | "completed" | "cancelled" | "failed";
  last_error: {
    code: "server_error" | "unsupported_file" | "invalid_file";
    message: string;
  } | null;
  chunking_strategy?: OpenAiChunkingStrategyResponse;
  attributes?: OpenAiVectorStoreFileAttributes;
}

// Create vector store file request
export interface OpenAiVectorStoreFileCreateRequest {
  file_id: string;
  chunking_strategy?: OpenAiChunkingStrategyRequest;
  attributes?: OpenAiVectorStoreFileAttributes;
}

// Update vector store file attributes request
export interface OpenAiVectorStoreFileUpdateRequest {
  attributes: OpenAiVectorStoreFileAttributes;
}

// List vector store files options
export interface OpenAiVectorStoreFileListOptions {
  limit?: number;
  order?: "asc" | "desc";
  after?: string;
  before?: string;
  filter?: "in_progress" | "completed" | "failed" | "cancelled";
}

// List vector store files response
export interface OpenAiVectorStoreFileListResponse {
  object: "list";
  data: OpenAiVectorStoreFile[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

// Delete vector store file response
export interface OpenAiVectorStoreFileDeleteResponse {
  id: string;
  object: "vector_store.file.deleted";
  deleted: boolean;
}

// Vector store file content response
export interface OpenAiVectorStoreFileContentResponse {
  object: "vector_store.file_content.page";
  data: { type: string; text: string }[];
  has_more: boolean;
  next_page: string | null;
}

// Vector store file batch object
export interface OpenAiVectorStoreFileBatch {
  id: string;
  object: "vector_store.files_batch";
  created_at: number;
  vector_store_id: string;
  status: "in_progress" | "completed" | "cancelled" | "failed";
  file_counts: OpenAiVectorStoreFileCounts;
}

// Create vector store file batch request
export interface OpenAiVectorStoreFileBatchCreateRequest {
  file_ids?: string[];
  files?: OpenAiVectorStoreFileCreateRequest[];
  chunking_strategy?: OpenAiChunkingStrategyRequest;
  attributes?: OpenAiVectorStoreFileAttributes;
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

// Stored completions namespace types
interface OpenAiStoredCompletionsListMethod {
  (
    opts?: OpenAiStoredCompletionListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiStoredCompletionListResponse>;
}

interface OpenAiStoredCompletionsRetrieveMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiChatResponse>;
}

interface OpenAiStoredCompletionsDeleteMethod {
  (
    id: string,
    signal?: AbortSignal
  ): Promise<OpenAiStoredCompletionDeleteResponse>;
  payloadSchema: PayloadSchema;
}

interface OpenAiStoredCompletionsUpdateMethod {
  (
    id: string,
    req: OpenAiStoredCompletionUpdateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiChatResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiStoredCompletionMessagesListMethod {
  (
    id: string,
    opts?: OpenAiStoredCompletionMessageListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiStoredCompletionMessageListResponse>;
}

interface OpenAiStoredCompletionMessagesNamespace {
  list: OpenAiStoredCompletionMessagesListMethod;
}

// Namespace types
interface OpenAiChatCompletionsMethod {
  (req: OpenAiChatRequest, signal?: AbortSignal): Promise<OpenAiChatResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  list: OpenAiStoredCompletionsListMethod;
  retrieve: OpenAiStoredCompletionsRetrieveMethod;
  del: OpenAiStoredCompletionsDeleteMethod;
  update: OpenAiStoredCompletionsUpdateMethod;
  messages: OpenAiStoredCompletionMessagesNamespace;
}

interface OpenAiChatNamespace {
  completions: OpenAiChatCompletionsMethod;
}

interface OpenAiEmbeddingsMethod {
  (
    req: OpenAiEmbeddingRequest,
    signal?: AbortSignal
  ): Promise<OpenAiEmbeddingResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiAudioSpeechMethod {
  (req: OpenAiSpeechRequest, signal?: AbortSignal): Promise<ArrayBuffer>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiAudioTranscriptionsMethod {
  (
    req: OpenAiTranscribeRequest,
    signal?: AbortSignal
  ): Promise<OpenAiTranscribeResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiAudioTranslationsMethod {
  (
    req: OpenAiTranslateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiTranslateResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiAudioNamespace {
  speech: OpenAiAudioSpeechMethod;
  transcriptions: OpenAiAudioTranscriptionsMethod;
  translations: OpenAiAudioTranslationsMethod;
}

interface OpenAiImagesEditsMethod {
  (
    req: OpenAiImageEditRequest,
    signal?: AbortSignal
  ): Promise<OpenAiImageEditResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiImageGenerationsMethod {
  (
    req: OpenAiImageGenerationRequest,
    signal?: AbortSignal
  ): Promise<OpenAiImageGenerationResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiImagesNamespace {
  edits: OpenAiImagesEditsMethod;
  generations: OpenAiImageGenerationsMethod;
}

interface OpenAiResponsesGetMethod {
  (
    id: string,
    opts?: OpenAiResponseGetOptions,
    signal?: AbortSignal
  ): Promise<OpenAiResponseResponse>;
}

interface OpenAiResponsesDeleteMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiResponseDeleteResponse>;
  payloadSchema: PayloadSchema;
}

interface OpenAiResponsesCancelMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiResponseResponse>;
  payloadSchema: PayloadSchema;
}

interface OpenAiResponsesInputItemsMethod {
  (
    id: string,
    opts?: OpenAiResponseInputItemsOptions,
    signal?: AbortSignal
  ): Promise<OpenAiResponseInputItemsResponse>;
}

interface OpenAiResponsesCompactMethod {
  (
    req: OpenAiResponseCompactRequest,
    signal?: AbortSignal
  ): Promise<OpenAiResponseCompactResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiResponsesInputTokensMethod {
  (
    req: OpenAiResponseInputTokensRequest,
    signal?: AbortSignal
  ): Promise<OpenAiResponseInputTokensResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiResponsesMethod {
  (
    req: OpenAiResponseRequest,
    signal?: AbortSignal
  ): Promise<OpenAiResponseResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  get: OpenAiResponsesGetMethod;
  del: OpenAiResponsesDeleteMethod;
  cancel: OpenAiResponsesCancelMethod;
  input_items: OpenAiResponsesInputItemsMethod;
  compact: OpenAiResponsesCompactMethod;
  input_tokens: OpenAiResponsesInputTokensMethod;
}

interface OpenAiFilesListMethod {
  (
    opts?: OpenAiFileListRequest,
    signal?: AbortSignal
  ): Promise<OpenAiFileListResponse>;
}

interface OpenAiFilesUploadMethod {
  (req: OpenAiFileUploadRequest, signal?: AbortSignal): Promise<OpenAiFile>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiFilesRetrieveMethod {
  (fileId: string, signal?: AbortSignal): Promise<OpenAiFile>;
}

interface OpenAiFilesDeleteMethod {
  (fileId: string, signal?: AbortSignal): Promise<OpenAiFileDeleteResponse>;
  payloadSchema: PayloadSchema;
}

interface OpenAiFilesContentMethod {
  (fileId: string, signal?: AbortSignal): Promise<string>;
}

interface OpenAiFilesNamespace {
  list: OpenAiFilesListMethod;
  upload: OpenAiFilesUploadMethod;
  retrieve: OpenAiFilesRetrieveMethod;
  del: OpenAiFilesDeleteMethod;
  content: OpenAiFilesContentMethod;
}

interface OpenAiBatchesCreateMethod {
  (req: OpenAiBatchCreateRequest, signal?: AbortSignal): Promise<OpenAiBatch>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  list: OpenAiBatchesListMethod;
  retrieve: OpenAiBatchesRetrieveMethod;
  cancel: OpenAiBatchesCancelMethod;
}

interface OpenAiBatchesListMethod {
  (
    params?: OpenAiBatchListParams,
    signal?: AbortSignal
  ): Promise<OpenAiBatchListResponse>;
}

interface OpenAiBatchesRetrieveMethod {
  (batchId: string, signal?: AbortSignal): Promise<OpenAiBatch>;
}

interface OpenAiBatchesCancelMethod {
  (batchId: string, signal?: AbortSignal): Promise<OpenAiBatch>;
  payloadSchema: PayloadSchema;
}

interface OpenAiModelsListMethod {
  (signal?: AbortSignal): Promise<OpenAiModelListResponse>;
}

interface OpenAiModelsRetrieveMethod {
  (model: string, signal?: AbortSignal): Promise<OpenAiModel>;
}

interface OpenAiModelsDeleteMethod {
  (model: string, signal?: AbortSignal): Promise<OpenAiModelDeleteResponse>;
  payloadSchema: PayloadSchema;
}

interface OpenAiModelsNamespace {
  list: OpenAiModelsListMethod;
  retrieve: OpenAiModelsRetrieveMethod;
  del: OpenAiModelsDeleteMethod;
}

interface OpenAiModerationsMethod {
  (
    req: OpenAiModerationRequest,
    signal?: AbortSignal
  ): Promise<OpenAiModerationResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

// Fine-tuning namespace types
interface OpenAiFineTuningJobsCreateMethod {
  (
    req: OpenAiFineTuningJobCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiFineTuningJob>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  list: OpenAiFineTuningJobsListMethod;
  retrieve: OpenAiFineTuningJobsRetrieveMethod;
  cancel: OpenAiFineTuningJobsCancelMethod;
  pause: OpenAiFineTuningJobsPauseMethod;
  resume: OpenAiFineTuningJobsResumeMethod;
  events: OpenAiFineTuningJobsEventsMethod;
  checkpoints: OpenAiFineTuningJobsCheckpointsMethod;
}

interface OpenAiFineTuningJobsListMethod {
  (
    opts?: OpenAiFineTuningJobListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiFineTuningJobListResponse>;
}

interface OpenAiFineTuningJobsRetrieveMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiFineTuningJob>;
}

interface OpenAiFineTuningJobsCancelMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiFineTuningJob>;
}

interface OpenAiFineTuningJobsPauseMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiFineTuningJob>;
}

interface OpenAiFineTuningJobsResumeMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiFineTuningJob>;
}

interface OpenAiFineTuningJobsEventsMethod {
  (
    id: string,
    opts?: OpenAiFineTuningJobEventListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiFineTuningJobEventListResponse>;
}

interface OpenAiFineTuningJobsCheckpointsMethod {
  (
    id: string,
    opts?: OpenAiFineTuningJobCheckpointListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiFineTuningJobCheckpointListResponse>;
}

interface OpenAiCheckpointPermissionsCreateMethod {
  (
    checkpoint: string,
    req: OpenAiCheckpointPermissionCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiCheckpointPermissionCreateResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  list: OpenAiCheckpointPermissionsListMethod;
  del: OpenAiCheckpointPermissionsDeleteMethod;
}

interface OpenAiCheckpointPermissionsListMethod {
  (
    checkpoint: string,
    opts?: OpenAiCheckpointPermissionListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiCheckpointPermissionListResponse>;
}

interface OpenAiCheckpointPermissionsDeleteMethod {
  (
    checkpoint: string,
    permissionId: string,
    signal?: AbortSignal
  ): Promise<OpenAiCheckpointPermissionDeleteResponse>;
}

interface OpenAiFineTuningCheckpointsNamespace {
  permissions: OpenAiCheckpointPermissionsCreateMethod;
}

interface OpenAiFineTuningNamespace {
  jobs: OpenAiFineTuningJobsCreateMethod;
  checkpoints: OpenAiFineTuningCheckpointsNamespace;
}

// Conversations namespace types
interface OpenAiConversationsCreateMethod {
  (
    req?: OpenAiConversationCreateRequest | null,
    signal?: AbortSignal
  ): Promise<OpenAiConversation>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  retrieve: OpenAiConversationsRetrieveMethod;
  update: OpenAiConversationsUpdateMethod;
  del: OpenAiConversationsDeleteMethod;
  items: OpenAiConversationItemsNamespace;
}

interface OpenAiConversationsRetrieveMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiConversation>;
}

interface OpenAiConversationsUpdateMethod {
  (
    id: string,
    req: OpenAiConversationUpdateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiConversation>;
// Vector stores namespace types
interface OpenAiVectorStoresCreateMethod {
  (
    req: OpenAiVectorStoreCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStore>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  list: OpenAiVectorStoresListMethod;
  retrieve: OpenAiVectorStoresRetrieveMethod;
  update: OpenAiVectorStoresUpdateMethod;
  del: OpenAiVectorStoresDeleteMethod;
  search: OpenAiVectorStoresSearchMethod;
  files: OpenAiVectorStoreFilesNamespace;
  file_batches: OpenAiVectorStoreFileBatchesNamespace;
}

interface OpenAiVectorStoresListMethod {
  (
    opts?: OpenAiVectorStoreListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreListResponse>;
}

interface OpenAiVectorStoresRetrieveMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiVectorStore>;
}

interface OpenAiVectorStoresUpdateMethod {
  (
    id: string,
    req: OpenAiVectorStoreUpdateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStore>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiConversationsDeleteMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiConversationDeleteResponse>;
}

interface OpenAiConversationItemsCreateMethod {
  (
    conversationId: string,
    req: OpenAiConversationItemsCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiConversationItemListResponse>;
interface OpenAiVectorStoresDeleteMethod {
  (id: string, signal?: AbortSignal): Promise<OpenAiVectorStoreDeleteResponse>;
  payloadSchema: PayloadSchema;
}

interface OpenAiVectorStoresSearchMethod {
  (
    id: string,
    req: OpenAiVectorStoreSearchRequest,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreSearchResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiConversationItemsRetrieveMethod {
  (
    conversationId: string,
    itemId: string,
    opts?: OpenAiConversationItemRetrieveOptions,
    signal?: AbortSignal
  ): Promise<OpenAiConversationItem>;
}

interface OpenAiConversationItemsListMethod {
  (
    conversationId: string,
    opts?: OpenAiConversationItemListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiConversationItemListResponse>;
}

interface OpenAiConversationItemsDeleteMethod {
  (
    conversationId: string,
    itemId: string,
    signal?: AbortSignal
  ): Promise<OpenAiConversation>;
}

interface OpenAiConversationItemsNamespace {
  create: OpenAiConversationItemsCreateMethod;
  retrieve: OpenAiConversationItemsRetrieveMethod;
  list: OpenAiConversationItemsListMethod;
  del: OpenAiConversationItemsDeleteMethod;
}

// Realtime namespace types
interface OpenAiRealtimeSessionsCreateMethod {
  (
    req: OpenAiRealtimeSessionCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiRealtimeSessionCreateResponse>;
interface OpenAiVectorStoreFilesCreateMethod {
  (
    vectorStoreId: string,
    req: OpenAiVectorStoreFileCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFile>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiRealtimeTranscriptionSessionsCreateMethod {
  (
    req?: OpenAiRealtimeTranscriptionSessionCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiRealtimeTranscriptionSessionCreateResponse>;
interface OpenAiVectorStoreFilesListMethod {
  (
    vectorStoreId: string,
    opts?: OpenAiVectorStoreFileListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFileListResponse>;
}

interface OpenAiVectorStoreFilesRetrieveMethod {
  (
    vectorStoreId: string,
    fileId: string,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFile>;
}

interface OpenAiVectorStoreFilesUpdateMethod {
  (
    vectorStoreId: string,
    fileId: string,
    req: OpenAiVectorStoreFileUpdateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFile>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiRealtimeClientSecretsCreateMethod {
  (
    req?: OpenAiRealtimeClientSecretCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiRealtimeClientSecretCreateResponse>;
interface OpenAiVectorStoreFilesDeleteMethod {
  (
    vectorStoreId: string,
    fileId: string,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFileDeleteResponse>;
  payloadSchema: PayloadSchema;
}

interface OpenAiVectorStoreFilesContentMethod {
  (
    vectorStoreId: string,
    fileId: string,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFileContentResponse>;
}

interface OpenAiVectorStoreFilesNamespace {
  create: OpenAiVectorStoreFilesCreateMethod;
  list: OpenAiVectorStoreFilesListMethod;
  retrieve: OpenAiVectorStoreFilesRetrieveMethod;
  update: OpenAiVectorStoreFilesUpdateMethod;
  del: OpenAiVectorStoreFilesDeleteMethod;
  content: OpenAiVectorStoreFilesContentMethod;
}

interface OpenAiVectorStoreFileBatchesCreateMethod {
  (
    vectorStoreId: string,
    req: OpenAiVectorStoreFileBatchCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFileBatch>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiRealtimeCallsAcceptMethod {
  (
    callId: string,
    req: OpenAiRealtimeCallAcceptRequest,
    signal?: AbortSignal
  ): Promise<void>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiRealtimeCallsHangupMethod {
  (callId: string, signal?: AbortSignal): Promise<void>;
}

interface OpenAiRealtimeCallsReferMethod {
  (
    callId: string,
    req: OpenAiRealtimeCallReferRequest,
    signal?: AbortSignal
  ): Promise<void>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiRealtimeCallsRejectMethod {
  (
    callId: string,
    req?: OpenAiRealtimeCallRejectRequest | null,
    signal?: AbortSignal
  ): Promise<void>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiRealtimeCallsNamespace {
  accept: OpenAiRealtimeCallsAcceptMethod;
  hangup: OpenAiRealtimeCallsHangupMethod;
  refer: OpenAiRealtimeCallsReferMethod;
  reject: OpenAiRealtimeCallsRejectMethod;
}

interface OpenAiRealtimeNamespace {
  sessions: OpenAiRealtimeSessionsCreateMethod;
  transcription_sessions: OpenAiRealtimeTranscriptionSessionsCreateMethod;
  client_secrets: OpenAiRealtimeClientSecretsCreateMethod;
  calls: OpenAiRealtimeCallsNamespace;
}

// Evals namespace types
interface OpenAiEvalsCreateMethod {
  (req: OpenAiEvalCreateRequest, signal?: AbortSignal): Promise<OpenAiEval>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  retrieve: OpenAiEvalsRetrieveMethod;
  update: OpenAiEvalsUpdateMethod;
  list: OpenAiEvalsListMethod;
  del: OpenAiEvalsDeleteMethod;
  runs: OpenAiEvalRunsNamespace;
}

interface OpenAiEvalsRetrieveMethod {
  (evalId: string, signal?: AbortSignal): Promise<OpenAiEval>;
}

interface OpenAiEvalsUpdateMethod {
  (
    evalId: string,
    req: OpenAiEvalUpdateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiEval>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiEvalsListMethod {
  (
    opts?: OpenAiEvalListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiEvalListResponse>;
}

interface OpenAiEvalsDeleteMethod {
  (evalId: string, signal?: AbortSignal): Promise<OpenAiEvalDeleteResponse>;
}

interface OpenAiEvalRunsCreateMethod {
  (
    evalId: string,
    req: OpenAiEvalRunCreateRequest,
    signal?: AbortSignal
  ): Promise<OpenAiEvalRun>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface OpenAiEvalRunsRetrieveMethod {
  (evalId: string, runId: string, signal?: AbortSignal): Promise<OpenAiEvalRun>;
}

interface OpenAiEvalRunsListMethod {
  (
    evalId: string,
    opts?: OpenAiEvalRunListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiEvalRunListResponse>;
}

interface OpenAiEvalRunsDeleteMethod {
  (
    evalId: string,
    runId: string,
    signal?: AbortSignal
  ): Promise<OpenAiEvalRunDeleteResponse>;
}

interface OpenAiEvalRunsCancelMethod {
  (evalId: string, runId: string, signal?: AbortSignal): Promise<OpenAiEvalRun>;
}

interface OpenAiEvalRunOutputItemsRetrieveMethod {
  (
    evalId: string,
    runId: string,
    outputItemId: string,
    signal?: AbortSignal
  ): Promise<OpenAiEvalRunOutputItem>;
}

interface OpenAiEvalRunOutputItemsListMethod {
  (
    evalId: string,
    runId: string,
    opts?: OpenAiEvalRunOutputItemListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiEvalRunOutputItemListResponse>;
}

interface OpenAiEvalRunOutputItemsNamespace {
  retrieve: OpenAiEvalRunOutputItemsRetrieveMethod;
  list: OpenAiEvalRunOutputItemsListMethod;
}

interface OpenAiEvalRunsNamespace {
  create: OpenAiEvalRunsCreateMethod;
  retrieve: OpenAiEvalRunsRetrieveMethod;
  list: OpenAiEvalRunsListMethod;
  del: OpenAiEvalRunsDeleteMethod;
  cancel: OpenAiEvalRunsCancelMethod;
  output_items: OpenAiEvalRunOutputItemsNamespace;
interface OpenAiVectorStoreFileBatchesRetrieveMethod {
  (
    vectorStoreId: string,
    batchId: string,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFileBatch>;
}

interface OpenAiVectorStoreFileBatchesCancelMethod {
  (
    vectorStoreId: string,
    batchId: string,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFileBatch>;
  payloadSchema: PayloadSchema;
}

interface OpenAiVectorStoreFileBatchesFilesMethod {
  (
    vectorStoreId: string,
    batchId: string,
    opts?: OpenAiVectorStoreFileListOptions,
    signal?: AbortSignal
  ): Promise<OpenAiVectorStoreFileListResponse>;
}

interface OpenAiVectorStoreFileBatchesNamespace {
  create: OpenAiVectorStoreFileBatchesCreateMethod;
  retrieve: OpenAiVectorStoreFileBatchesRetrieveMethod;
  cancel: OpenAiVectorStoreFileBatchesCancelMethod;
  files: OpenAiVectorStoreFileBatchesFilesMethod;
}

interface OpenAiV1Namespace {
  chat: OpenAiChatNamespace;
  audio: OpenAiAudioNamespace;
  embeddings: OpenAiEmbeddingsMethod;
  files: OpenAiFilesNamespace;
  images: OpenAiImagesNamespace;
  models: OpenAiModelsNamespace;
  moderations: OpenAiModerationsMethod;
  responses: OpenAiResponsesMethod;
  fine_tuning: OpenAiFineTuningNamespace;
  batches: OpenAiBatchesCreateMethod;
  conversations: OpenAiConversationsCreateMethod;
  realtime: OpenAiRealtimeNamespace;
  evals: OpenAiEvalsCreateMethod;
  vector_stores: OpenAiVectorStoresCreateMethod;
}

// Provider interface
export interface OpenAiProvider {
  v1: OpenAiV1Namespace;
}

// Error class
export class OpenAiError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly code?: string;

  constructor(message: string, status: number, body?: unknown, code?: string) {
    super(message);
    this.name = "OpenAiError";
    this.status = status;
    this.body = body ?? null;
    this.code = code;
  }
}
