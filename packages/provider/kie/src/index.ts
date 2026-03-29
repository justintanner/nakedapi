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
export { createFluxProvider } from "./flux";
export { createRunwayProvider } from "./runway";
export { createCodexProvider } from "./codex";
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

// Export sub-provider types — Veo
export type {
  VeoModel,
  VeoGenerationType,
  VeoGenerateRequest,
  VeoExtendRequest,
  VeoGet4kVideoRequest,
  VeoRecordInfoData,
  VeoRecordInfoResponse,
  Veo1080pResponse,
  Veo4kResponse,
  VeoProvider,
} from "./veo";

// Export sub-provider types — Suno
export type {
  SunoModel,
  SunoGenerateRequest,
  SunoExtendRequest,
  SunoUploadCoverRequest,
  SunoUploadExtendRequest,
  SunoAddInstrumentalRequest,
  SunoAddVocalsRequest,
  SunoReplaceSectionRequest,
  SunoTimestampedLyricsRequest,
  SunoGeneratePersonaRequest,
  SunoMashupRequest,
  SunoSoundsRequest,
  SunoCoverArtRequest,
  LyricsGenerateRequest,
  VocalRemovalRequest,
  MidiGenerateRequest,
  WavGenerateRequest,
  Mp4GenerateRequest,
  StyleGenerateRequest,
  SunoRecordInfoSunoData,
  SunoRecordInfoData,
  SunoRecordInfoResponse,
  SunoTimestampedLyricsWord,
  SunoTimestampedLyricsResponse,
  SunoPersonaResponse,
  SunoCoverArtRecordInfoData,
  SunoCoverArtRecordInfoResponse,
  LyricsRecordInfoData,
  LyricsRecordInfoResponse,
  VocalRemovalRecordInfoData,
  VocalRemovalRecordInfoResponse,
  MidiRecordInfoInstrument,
  MidiRecordInfoData,
  MidiRecordInfoResponse,
  WavRecordInfoResponse,
  Mp4RecordInfoResponse,
  StyleGenerateResponse,
  SunoProvider,
} from "./suno";

// Export sub-provider types — Chat
export type {
  KieChatContentPart,
  KieChatMessage,
  KieChatRequest,
  KieChatChoice,
  KieChatUsage,
  KieChatResponse,
  KieChatProvider,
} from "./chat";

// Export sub-provider types — Claude
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

// Export sub-provider types — GPT-4o Image
export type {
  Gpt4oImageGenerateRequest,
  Gpt4oImageDownloadUrlRequest,
  Gpt4oImageRecordInfoData,
  Gpt4oImageRecordInfoResponse,
  Gpt4oImageGenerateResponse,
  Gpt4oImageDownloadUrlResponse,
  Gpt4oImageProvider,
} from "./gpt4o-image";

// Export sub-provider types — Flux Kontext
export type {
  FluxKontextModel,
  FluxKontextGenerateRequest,
  FluxKontextRecordInfoData,
  FluxKontextRecordInfoResponse,
  FluxKontextGenerateResponse,
  FluxProvider,
} from "./flux";

// Export sub-provider types — Runway / Aleph
export type {
  RunwayGenerateRequest,
  RunwayExtendRequest,
  AlephGenerateRequest,
  RunwayRecordDetailVideoInfo,
  RunwayRecordDetailData,
  RunwayRecordDetailResponse,
  RunwaySubmitResponse,
  AlephRecordInfoData,
  AlephRecordInfoResponse,
  RunwayProvider,
} from "./runway";

// Export sub-provider types — Codex
export type {
  KieCodexModel,
  KieCodexTool,
  KieCodexRequest,
  KieCodexOutputItem,
  KieCodexResponse,
  KieCodexProvider,
} from "./codex";

// Export sub-provider types — Gemini
export type {
  KieGeminiModel,
  KieGeminiChatMessage,
  KieGeminiChatRequest,
  KieGeminiChatChoice,
  KieGeminiChatUsage,
  KieGeminiChatResponse,
  KieGeminiProvider,
} from "./gemini";
