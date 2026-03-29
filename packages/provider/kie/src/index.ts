// Export main provider function
export { kie } from "./kie";

// Export error class
export { KieError } from "./types";

// Export middleware
export { withRetry, withFallback } from "./middleware";
export type { RetryOptions, FallbackOptions } from "./middleware";

// Export sub-provider factory functions
export { createVeoProvider } from "./veo";
export { createSunoProvider } from "./suno";
export { createChatProvider } from "./chat";
export { createClaudeProvider } from "./claude";
export { createGeminiProvider } from "./gemini";

// Export SSE utility
export { sseToIterable } from "./sse";

// Export all types
export type {
  KieMediaModel,
  MediaType,
  KlingElement,
  MultiShotPrompt,
  MediaRequest,
  KlingVideoRequest,
  KlingMotionControlRequest,
  GrokTextToImageRequest,
  GrokImageToImageRequest,
  GrokTextToVideoRequest,
  GrokImageToVideoRequest,
  GrokVideoExtendRequest,
  GrokVideoUpscaleRequest,
  NanoBananaProRequest,
  SeedanceVideoRequest,
  NanoBanana2Request,
  GptImageToImageRequest,
  SeedreamImageToImageRequest,
  ElevenLabsVoice,
  DialogueLine,
  ElevenLabsDialogueRequest,
  ElevenLabsSfxRequest,
  ElevenLabsSttRequest,
  ElevenLabsAudioIsolationRequest,
  SoraWatermarkRequest,
  MediaGenerationRequest,
  TaskResponse,
  KieOptions,
  KieProvider,
  KieApiEnvelope,
  KieTaskState,
  KieTaskInfoData,
  KieTaskInfo,
  KieCreditsResponse,
  VocalRemovalType,
  VocalRemovalRequest,
  VocalSeparationInfo,
  SplitStemInfo,
  VocalRemovalInfoData,
  VocalRemovalResponse,
  VocalRemovalInfo,
  MidiGenerateRequest,
  MidiNote,
  MidiInstrument,
  MidiInfoData,
  MidiGenerateResponse,
  MidiInfo,
  WavGenerateRequest,
  WavInfoData,
  WavGenerateResponse,
  WavInfo,
  DownloadUrlRequest,
  DownloadUrlResponse,
  UploadMediaRequest,
  UploadMediaResponse,
  FileUrlUploadRequest,
  FileBase64UploadRequest,
  PayloadFieldSchema,
  PayloadSchema,
  ValidationResult,
  ModelInputSchema,
  CodexModel,
  CodexInputText,
  CodexInputImage,
  CodexInputFile,
  CodexInputPart,
  CodexInputMessage,
  CodexWebSearchTool,
  CodexFunctionTool,
  CodexTool,
  CodexResponsesRequest,
  CodexReasoningOutput,
  CodexOutputText,
  CodexMessageOutput,
  CodexOutputBlock,
  CodexUsage,
  CodexResponsesResponse,
  GeminiModel,
  GeminiChatContentPart,
  GeminiChatMessage,
  GeminiFunctionTool,
  GeminiTool,
  GeminiChatRequest,
  GeminiChatChoice,
  GeminiChatUsage,
  GeminiChatResponse,
  StyleGenerateRequest,
  StyleGenerateData,
  StyleGenerateResponse,
  Mp4GenerateRequest,
  Mp4GenerateResponse,
  Mp4RecordInfoData,
  Mp4RecordInfoResponse,
} from "./types";

// Export sub-provider types
export type {
  VeoModel,
  VeoGenerationType,
  VeoGenerateRequest,
  VeoExtendRequest,
  VeoProvider,
} from "./veo";

export type { SunoModel, SunoGenerateRequest, SunoProvider } from "./suno";

export type {
  KieChatContentPart,
  KieChatMessage,
  KieChatRequest,
  KieChatChoice,
  KieChatUsage,
  KieChatResponse,
  KieChatProvider,
} from "./chat";

export type {
  KieClaudeToolInputSchema,
  KieClaudeTool,
  KieClaudeContentPart,
  KieClaudeMessage,
  KieClaudeRequest,
  KieClaudeUsage,
  KieClaudeToolUseContent,
  KieClaudeTextContent,
  KieClaudeContentBlock,
  KieClaudeResponse,
  KieClaudeProvider,
} from "./claude";

export type { KieGeminiProvider } from "./gemini";
