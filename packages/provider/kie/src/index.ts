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
export { createGpt4oImageProvider } from "./gpt4o-image";
export { createFluxKontextProvider } from "./flux-kontext";
export { createRunwayProvider } from "./runway";
export { createAlephProvider } from "./aleph";

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

export type {
  Gpt4oImageFallbackModel,
  Gpt4oImageGenerateRequest,
  Gpt4oImageDownloadUrlRequest,
  Gpt4oImageRecordInfoData,
  Gpt4oImageRecordInfo,
  Gpt4oImageDownloadUrl,
  Gpt4oImageProvider,
} from "./gpt4o-image";

export type {
  FluxKontextModel,
  FluxKontextGenerateRequest,
  FluxKontextRecordInfoData,
  FluxKontextRecordInfo,
  FluxKontextProvider,
} from "./flux-kontext";

export type {
  RunwayGenerateRequest,
  RunwayExtendRequest,
  RunwayVideoInfo,
  RunwayRecordDetailData,
  RunwayRecordDetail,
  RunwayProvider,
} from "./runway";

export type {
  AlephGenerateRequest,
  AlephRecordInfoData,
  AlephRecordInfo,
  AlephProvider,
} from "./aleph";
