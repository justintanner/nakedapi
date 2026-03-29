import { kieRequest } from "./request";
import type { PayloadSchema, ValidationResult } from "./types";
import {
  sunoGenerateSchema,
  sunoExtendSchema,
  sunoUploadCoverSchema,
  sunoUploadExtendSchema,
  sunoAddInstrumentalSchema,
  sunoAddVocalsSchema,
  sunoReplaceSectionSchema,
  sunoTimestampedLyricsSchema,
  sunoGeneratePersonaSchema,
  sunoMashupSchema,
  sunoSoundsSchema,
  sunoCoverGenerateSchema,
  lyricsGenerateSchema,
  vocalRemovalGenerateSchema,
  midiGenerateSchema,
  wavGenerateSchema,
  mp4GenerateSchema,
  styleGenerateSchema,
} from "./schemas";
import { validatePayload } from "./validate";

export type SunoModel = "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5";

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export interface SunoGenerateRequest {
  prompt: string;
  model: SunoModel;
  instrumental: boolean;
  customMode: boolean;
  style?: string;
  negativeTags?: string;
  title?: string;
}

export interface SunoExtendRequest {
  audioId: string;
  prompt: string;
  model: SunoModel;
  defaultParamFlag: boolean;
  callBackUrl?: string;
  style?: string;
  title?: string;
  continueAt?: number;
  negativeTags?: string;
}

export interface SunoUploadCoverRequest {
  uploadUrl: string;
  prompt: string;
  customMode: boolean;
  instrumental: boolean;
  model: SunoModel;
  callBackUrl?: string;
  style?: string;
  title?: string;
  negativeTags?: string;
}

export interface SunoUploadExtendRequest {
  uploadUrl: string;
  defaultParamFlag: boolean;
  instrumental: boolean;
  continueAt: number;
  model: SunoModel;
  callBackUrl?: string;
  prompt?: string;
  style?: string;
  title?: string;
  negativeTags?: string;
}

export interface SunoAddInstrumentalRequest {
  uploadUrl: string;
  title: string;
  tags: string;
  negativeTags?: string;
  callBackUrl?: string;
  model?: SunoModel;
}

export interface SunoAddVocalsRequest {
  prompt: string;
  title: string;
  negativeTags?: string;
  style: string;
  uploadUrl: string;
  callBackUrl?: string;
  model?: SunoModel;
  vocalGender?: "male" | "female";
}

export interface SunoReplaceSectionRequest {
  taskId: string;
  audioId: string;
  prompt: string;
  tags: string;
  title: string;
  infillStartS: number;
  infillEndS: number;
  negativeTags?: string;
  fullLyrics?: string;
  callBackUrl?: string;
}

export interface SunoTimestampedLyricsRequest {
  taskId: string;
  audioId: string;
}

export interface SunoGeneratePersonaRequest {
  taskId: string;
  audioId: string;
  name: string;
  description: string;
  vocalStart?: number;
  vocalEnd?: number;
  style?: string;
}

export interface SunoMashupRequest {
  uploadUrlList: [string, string];
  customMode: boolean;
  model: SunoModel;
  callBackUrl?: string;
  prompt?: string;
  style?: string;
  title?: string;
  instrumental?: boolean;
  negativeTags?: string;
}

export interface SunoSoundsRequest {
  prompt: string;
  model: "V5" | "V5_5";
  soundLoop?: boolean;
  soundTempo?: number;
  soundKey?: string;
  grabLyrics?: boolean;
  callBackUrl?: string;
}

export interface SunoCoverArtRequest {
  taskId: string;
  callBackUrl?: string;
}

export interface LyricsGenerateRequest {
  prompt: string;
  callBackUrl?: string;
}

export interface VocalRemovalRequest {
  taskId: string;
  audioId: string;
  type: "separate_vocal" | "split_stem";
  callBackUrl?: string;
}

export interface MidiGenerateRequest {
  taskId: string;
  callBackUrl?: string;
  audioId?: string;
}

export interface WavGenerateRequest {
  taskId: string;
  audioId: string;
  callBackUrl?: string;
}

export interface Mp4GenerateRequest {
  taskId: string;
  audioId: string;
  callBackUrl?: string;
  author?: string;
  domainName?: string;
}

export interface StyleGenerateRequest {
  content: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

interface SunoSubmitResponse {
  code: number;
  msg?: string;
  data?: {
    taskId?: string;
  };
}

export interface SunoRecordInfoSunoData {
  audioUrl?: string;
  streamAudioUrl?: string;
  imageUrl?: string;
  title?: string;
  tags?: string;
  duration?: number;
  audioId?: string;
}

export interface SunoRecordInfoData {
  taskId?: string;
  status?: string;
  sunoData?: SunoRecordInfoSunoData[];
  failMsg?: string;
}

export type SunoRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: SunoRecordInfoData;
};

export interface SunoTimestampedLyricsWord {
  word: string;
  startS: number;
  endS: number;
}

export type SunoTimestampedLyricsResponse = {
  code: number;
  msg?: string;
  data?: { alignedWords?: SunoTimestampedLyricsWord[] };
};

export type SunoPersonaResponse = {
  code: number;
  msg?: string;
  data?: { personaId?: string };
};

export interface SunoCoverArtRecordInfoData {
  taskId?: string;
  status?: string;
  images?: string[];
}

export type SunoCoverArtRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: SunoCoverArtRecordInfoData;
};

export interface LyricsRecordInfoData {
  taskId?: string;
  status?: string;
  text?: string;
  title?: string;
}

export type LyricsRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: LyricsRecordInfoData;
};

export interface VocalRemovalRecordInfoData {
  taskId?: string;
  status?: string;
  vocalUrl?: string;
  instrumentalUrl?: string;
  drumsUrl?: string;
  bassUrl?: string;
  guitarUrl?: string;
  pianoUrl?: string;
  otherUrl?: string;
}

export type VocalRemovalRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: VocalRemovalRecordInfoData;
};

export interface MidiRecordInfoInstrument {
  notes?: { pitch: number; start: number; end: number; velocity: number }[];
}

export interface MidiRecordInfoData {
  taskId?: string;
  status?: string;
  midiData?: { instruments?: MidiRecordInfoInstrument[] };
}

export type MidiRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: MidiRecordInfoData;
};

export type WavRecordInfoResponse = {
  code: number;
  msg?: string;
  data?: { taskId?: string; status?: string; audioWavUrl?: string };
};

export type Mp4RecordInfoResponse = {
  code: number;
  msg?: string;
  data?: { taskId?: string; status?: string; videoUrl?: string };
};

export type StyleGenerateResponse = {
  code: number;
  msg?: string;
  data?: {
    content?: string;
    creditsConsumed?: number;
    creditsRemaining?: number;
  };
};

// ---------------------------------------------------------------------------
// Namespace types
// ---------------------------------------------------------------------------

interface SunoExtendMethod {
  (req: SunoExtendRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoUploadCoverMethod {
  (req: SunoUploadCoverRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoUploadExtendMethod {
  (req: SunoUploadExtendRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoAddInstrumentalMethod {
  (req: SunoAddInstrumentalRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoAddVocalsMethod {
  (req: SunoAddVocalsRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoReplaceSectionMethod {
  (req: SunoReplaceSectionRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoTimestampedLyricsMethod {
  (req: SunoTimestampedLyricsRequest): Promise<SunoTimestampedLyricsResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoPersonaMethod {
  (req: SunoGeneratePersonaRequest): Promise<SunoPersonaResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoMashupMethod {
  (req: SunoMashupRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoSoundsMethod {
  (req: SunoSoundsRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoCoverArtGenerateMethod {
  (req: SunoCoverArtRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface VocalRemovalMethod {
  (req: VocalRemovalRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface MidiGenerateMethod {
  (req: MidiGenerateRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface WavGenerateMethod {
  (req: WavGenerateRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface Mp4GenerateMethod {
  (req: Mp4GenerateRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface StyleGenerateMethod {
  (req: StyleGenerateRequest): Promise<StyleGenerateResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface SunoCoverNamespace {
  generate: SunoCoverArtGenerateMethod;
  "record-info"(taskId: string): Promise<SunoCoverArtRecordInfoResponse>;
}

interface SunoGenerateNamespace {
  (req: SunoGenerateRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  "record-info"(taskId: string): Promise<SunoRecordInfoResponse>;
  extend: SunoExtendMethod;
  "upload-cover": SunoUploadCoverMethod;
  "upload-extend": SunoUploadExtendMethod;
  "add-instrumental": SunoAddInstrumentalMethod;
  "add-vocals": SunoAddVocalsMethod;
  "replace-section": SunoReplaceSectionMethod;
  "get-timestamped-lyrics": SunoTimestampedLyricsMethod;
  "generate-persona": SunoPersonaMethod;
  mashup: SunoMashupMethod;
  sounds: SunoSoundsMethod;
}

interface SunoLyricsNamespace {
  (req: LyricsGenerateRequest): Promise<SunoSubmitResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
  "record-info"(taskId: string): Promise<LyricsRecordInfoResponse>;
}

interface SunoVocalRemovalNamespace {
  generate: VocalRemovalMethod;
  "record-info"(taskId: string): Promise<VocalRemovalRecordInfoResponse>;
}

interface SunoMidiNamespace {
  generate: MidiGenerateMethod;
  "record-info"(taskId: string): Promise<MidiRecordInfoResponse>;
}

interface SunoWavNamespace {
  generate: WavGenerateMethod;
  "record-info"(taskId: string): Promise<WavRecordInfoResponse>;
}

interface SunoMp4Namespace {
  generate: Mp4GenerateMethod;
  "record-info"(taskId: string): Promise<Mp4RecordInfoResponse>;
}

interface SunoStyleNamespace {
  generate: StyleGenerateMethod;
}

interface SunoV1Namespace {
  generate: SunoGenerateNamespace;
  suno: { cover: SunoCoverNamespace };
  lyrics: SunoLyricsNamespace;
  "vocal-removal": SunoVocalRemovalNamespace;
  midi: SunoMidiNamespace;
  wav: SunoWavNamespace;
  mp4: SunoMp4Namespace;
  style: SunoStyleNamespace;
}

interface SunoApiNamespace {
  v1: SunoV1Namespace;
}

export interface SunoProvider {
  api: SunoApiNamespace;
}

export function createSunoProvider(
  baseURL: string,
  apiKey: string,
  doFetch: typeof fetch,
  timeout: number
): SunoProvider {
  const requestOpts = { apiKey, doFetch, timeout };

  // Helper for GET record-info endpoints
  function getRecordInfo<T>(path: string) {
    return async (taskId: string): Promise<T> =>
      kieRequest<T>(`${baseURL}${path}?taskId=${encodeURIComponent(taskId)}`, {
        method: "GET",
        ...requestOpts,
      });
  }

  // Helper to create POST methods with schema
  function postMethod<Req, Res>(
    path: string,
    schema: PayloadSchema
  ): {
    fn: (req: Req) => Promise<Res>;
    schema: PayloadSchema;
  } {
    return {
      fn: async (req: Req): Promise<Res> =>
        kieRequest<Res>(`${baseURL}${path}`, {
          method: "POST",
          body: req,
          ...requestOpts,
        }),
      schema,
    };
  }

  // Generate
  const gen = postMethod<SunoGenerateRequest, SunoSubmitResponse>(
    "/api/v1/generate",
    sunoGenerateSchema
  );
  const ext = postMethod<SunoExtendRequest, SunoSubmitResponse>(
    "/api/v1/generate/extend",
    sunoExtendSchema
  );
  const uploadCover = postMethod<SunoUploadCoverRequest, SunoSubmitResponse>(
    "/api/v1/generate/upload-cover",
    sunoUploadCoverSchema
  );
  const uploadExtend = postMethod<SunoUploadExtendRequest, SunoSubmitResponse>(
    "/api/v1/generate/upload-extend",
    sunoUploadExtendSchema
  );
  const addInstr = postMethod<SunoAddInstrumentalRequest, SunoSubmitResponse>(
    "/api/v1/generate/add-instrumental",
    sunoAddInstrumentalSchema
  );
  const addVocals = postMethod<SunoAddVocalsRequest, SunoSubmitResponse>(
    "/api/v1/generate/add-vocals",
    sunoAddVocalsSchema
  );
  const replaceSection = postMethod<
    SunoReplaceSectionRequest,
    SunoSubmitResponse
  >("/api/v1/generate/replace-section", sunoReplaceSectionSchema);
  const tsLyrics = postMethod<
    SunoTimestampedLyricsRequest,
    SunoTimestampedLyricsResponse
  >("/api/v1/generate/get-timestamped-lyrics", sunoTimestampedLyricsSchema);
  const persona = postMethod<SunoGeneratePersonaRequest, SunoPersonaResponse>(
    "/api/v1/generate/generate-persona",
    sunoGeneratePersonaSchema
  );
  const mashup = postMethod<SunoMashupRequest, SunoSubmitResponse>(
    "/api/v1/generate/mashup",
    sunoMashupSchema
  );
  const sounds = postMethod<SunoSoundsRequest, SunoSubmitResponse>(
    "/api/v1/generate/sounds",
    sunoSoundsSchema
  );

  // Cover art
  const coverGen = postMethod<SunoCoverArtRequest, SunoSubmitResponse>(
    "/api/v1/suno/cover/generate",
    sunoCoverGenerateSchema
  );

  // Lyrics
  const lyricsGen = postMethod<LyricsGenerateRequest, SunoSubmitResponse>(
    "/api/v1/lyrics",
    lyricsGenerateSchema
  );

  // Audio processing
  const vocalRemoval = postMethod<VocalRemovalRequest, SunoSubmitResponse>(
    "/api/v1/vocal-removal/generate",
    vocalRemovalGenerateSchema
  );
  const midiGen = postMethod<MidiGenerateRequest, SunoSubmitResponse>(
    "/api/v1/midi/generate",
    midiGenerateSchema
  );
  const wavGen = postMethod<WavGenerateRequest, SunoSubmitResponse>(
    "/api/v1/wav/generate",
    wavGenerateSchema
  );
  const mp4Gen = postMethod<Mp4GenerateRequest, SunoSubmitResponse>(
    "/api/v1/mp4/generate",
    mp4GenerateSchema
  );

  // Style
  const styleGen = postMethod<StyleGenerateRequest, StyleGenerateResponse>(
    "/api/v1/style/generate",
    styleGenerateSchema
  );

  function withSchema<F extends (...args: never[]) => unknown>(
    fn: F,
    schema: PayloadSchema
  ) {
    return Object.assign(fn, {
      payloadSchema: schema,
      validatePayload(data: unknown): ValidationResult {
        return validatePayload(data, schema);
      },
    });
  }

  const generateNamespace = Object.assign(withSchema(gen.fn, gen.schema), {
    "record-info": getRecordInfo<SunoRecordInfoResponse>(
      "/api/v1/generate/record-info"
    ),
    extend: withSchema(ext.fn, ext.schema),
    "upload-cover": withSchema(uploadCover.fn, uploadCover.schema),
    "upload-extend": withSchema(uploadExtend.fn, uploadExtend.schema),
    "add-instrumental": withSchema(addInstr.fn, addInstr.schema),
    "add-vocals": withSchema(addVocals.fn, addVocals.schema),
    "replace-section": withSchema(replaceSection.fn, replaceSection.schema),
    "get-timestamped-lyrics": withSchema(tsLyrics.fn, tsLyrics.schema),
    "generate-persona": withSchema(persona.fn, persona.schema),
    mashup: withSchema(mashup.fn, mashup.schema),
    sounds: withSchema(sounds.fn, sounds.schema),
  });

  const lyricsNamespace = Object.assign(
    withSchema(lyricsGen.fn, lyricsGen.schema),
    {
      "record-info": getRecordInfo<LyricsRecordInfoResponse>(
        "/api/v1/lyrics/record-info"
      ),
    }
  );

  return {
    api: {
      v1: {
        generate: generateNamespace as SunoGenerateNamespace,
        suno: {
          cover: {
            generate: withSchema(coverGen.fn, coverGen.schema),
            "record-info": getRecordInfo<SunoCoverArtRecordInfoResponse>(
              "/api/v1/suno/cover/record-info"
            ),
          },
        },
        lyrics: lyricsNamespace as SunoLyricsNamespace,
        "vocal-removal": {
          generate: withSchema(vocalRemoval.fn, vocalRemoval.schema),
          "record-info": getRecordInfo<VocalRemovalRecordInfoResponse>(
            "/api/v1/vocal-removal/record-info"
          ),
        },
        midi: {
          generate: withSchema(midiGen.fn, midiGen.schema),
          "record-info": getRecordInfo<MidiRecordInfoResponse>(
            "/api/v1/midi/record-info"
          ),
        },
        wav: {
          generate: withSchema(wavGen.fn, wavGen.schema),
          "record-info": getRecordInfo<WavRecordInfoResponse>(
            "/api/v1/wav/record-info"
          ),
        },
        mp4: {
          generate: withSchema(mp4Gen.fn, mp4Gen.schema),
          "record-info": getRecordInfo<Mp4RecordInfoResponse>(
            "/api/v1/mp4/record-info"
          ),
        },
        style: {
          generate: withSchema(styleGen.fn, styleGen.schema),
        },
      },
    },
  };
}
