import { kieRequest } from "./request";
import type {
  PayloadSchema,
  ValidationResult,
  VocalRemovalRequest,
  VocalRemovalResponse,
  VocalRemovalInfo,
  MidiGenerateRequest,
  MidiGenerateResponse,
  MidiInfo,
  WavGenerateRequest,
  WavGenerateResponse,
  WavInfo,
} from "./types";
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
  sunoLyricsSchema,
  vocalRemovalGenerateSchema,
  midiGenerateSchema,
  wavGenerateSchema,
} from "./schemas";
import { validatePayload } from "./validate";

export type SunoModel = "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5" | "V5_5";

export type SunoVocalGender = "m" | "f";

export type SunoSoundKey =
  | "Cm"
  | "C#m"
  | "Dm"
  | "D#m"
  | "Em"
  | "Fm"
  | "F#m"
  | "Gm"
  | "G#m"
  | "Am"
  | "A#m"
  | "Bm"
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B"
  | "Any";

export interface SunoGenerateRequest {
  prompt: string;
  model: SunoModel;
  instrumental: boolean;
  customMode: boolean;
  callBackUrl?: string;
  style?: string;
  negativeTags?: string;
  title?: string;
  vocalGender?: SunoVocalGender;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
  personaId?: string;
}

export interface SunoExtendRequest {
  audioId: string;
  defaultParamFlag: boolean;
  model: SunoModel;
  callBackUrl?: string;
  continueAt?: number;
  prompt?: string;
  style?: string;
  title?: string;
  negativeTags?: string;
  vocalGender?: SunoVocalGender;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
  personaId?: string;
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
  vocalGender?: SunoVocalGender;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
  personaId?: string;
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
  vocalGender?: SunoVocalGender;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
  personaId?: string;
}

export interface SunoAddInstrumentalRequest {
  uploadUrl: string;
  title: string;
  tags: string;
  negativeTags: string;
  callBackUrl?: string;
  model?: "V4_5PLUS" | "V5" | "V5_5";
  vocalGender?: SunoVocalGender;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
}

export interface SunoAddVocalsRequest {
  prompt: string;
  title: string;
  negativeTags: string;
  style: string;
  uploadUrl: string;
  callBackUrl?: string;
  model?: "V4_5PLUS" | "V5" | "V5_5";
  vocalGender?: SunoVocalGender;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
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

export interface SunoAlignedWord {
  word: string;
  success: boolean;
  startS: number;
  endS: number;
  palign: number;
}

export interface SunoTimestampedLyricsData {
  alignedWords: SunoAlignedWord[];
  waveformData: number[];
  hootCer: number;
  isStreamed: boolean;
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

export interface SunoPersonaData {
  personaId: string;
  name: string;
  description: string;
}

export interface SunoMashupRequest {
  uploadUrlList: [string, string];
  customMode: boolean;
  model: SunoModel;
  callBackUrl?: string;
  instrumental?: boolean;
  prompt?: string;
  style?: string;
  title?: string;
  vocalGender?: SunoVocalGender;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
}

export interface SunoSoundsRequest {
  prompt: string;
  model?: "V5" | "V5_5";
  soundLoop?: boolean;
  soundTempo?: number;
  soundKey?: SunoSoundKey;
  grabLyrics?: boolean;
  callBackUrl?: string;
}

export interface SunoCoverGenerateRequest {
  taskId: string;
  callBackUrl?: string;
}

export interface SunoLyricsRequest {
  prompt: string;
  callBackUrl?: string;
}

// Response types

interface SunoSubmitResponse {
  code: number;
  msg?: string;
  data?: {
    taskId?: string;
  };
}

interface SunoTimestampedLyricsResponse {
  code: number;
  msg?: string;
  data?: SunoTimestampedLyricsData;
}

interface SunoPersonaResponse {
  code: number;
  msg?: string;
  data?: SunoPersonaData;
}

// Method interfaces

interface SunoEndpointMethod<TReq, TRes> {
  (req: TReq): Promise<TRes>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface VocalRemovalGenerateMethod {
  (req: VocalRemovalRequest): Promise<VocalRemovalResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface VocalRemovalNamespace {
  generate: VocalRemovalGenerateMethod;
  "record-info"(taskId: string): Promise<VocalRemovalInfo>;
}

interface MidiGenerateMethod {
  (req: MidiGenerateRequest): Promise<MidiGenerateResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface MidiNamespace {
  generate: MidiGenerateMethod;
  "record-info"(taskId: string): Promise<MidiInfo>;
}

interface WavGenerateMethod {
  (req: WavGenerateRequest): Promise<WavGenerateResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

interface WavNamespace {
  generate: WavGenerateMethod;
  "record-info"(taskId: string): Promise<WavInfo>;
}

type SunoGenerateMethod = SunoEndpointMethod<
  SunoGenerateRequest,
  SunoSubmitResponse
>;
type SunoExtendMethod = SunoEndpointMethod<
  SunoExtendRequest,
  SunoSubmitResponse
>;
type SunoUploadCoverMethod = SunoEndpointMethod<
  SunoUploadCoverRequest,
  SunoSubmitResponse
>;
type SunoUploadExtendMethod = SunoEndpointMethod<
  SunoUploadExtendRequest,
  SunoSubmitResponse
>;
type SunoAddInstrumentalMethod = SunoEndpointMethod<
  SunoAddInstrumentalRequest,
  SunoSubmitResponse
>;
type SunoAddVocalsMethod = SunoEndpointMethod<
  SunoAddVocalsRequest,
  SunoSubmitResponse
>;
type SunoReplaceSectionMethod = SunoEndpointMethod<
  SunoReplaceSectionRequest,
  SunoSubmitResponse
>;
type SunoTimestampedLyricsMethod = SunoEndpointMethod<
  SunoTimestampedLyricsRequest,
  SunoTimestampedLyricsResponse
>;
type SunoPersonaMethod = SunoEndpointMethod<
  SunoGeneratePersonaRequest,
  SunoPersonaResponse
>;
type SunoMashupMethod = SunoEndpointMethod<
  SunoMashupRequest,
  SunoSubmitResponse
>;
type SunoSoundsMethod = SunoEndpointMethod<
  SunoSoundsRequest,
  SunoSubmitResponse
>;
type SunoCoverGenerateMethod = SunoEndpointMethod<
  SunoCoverGenerateRequest,
  SunoSubmitResponse
>;
type SunoLyricsMethod = SunoEndpointMethod<
  SunoLyricsRequest,
  SunoSubmitResponse
>;

// Callable namespace: generate(...) + generate.extend(...) etc.
interface SunoGenerateCallable extends SunoGenerateMethod {
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

interface SunoCoverNamespace {
  generate: SunoCoverGenerateMethod;
}

interface SunoSunoNamespace {
  cover: SunoCoverNamespace;
}

interface SunoV1Namespace {
  generate: SunoGenerateCallable;
  suno: SunoSunoNamespace;
  lyrics: SunoLyricsMethod;
  "vocal-removal": VocalRemovalNamespace;
  midi: MidiNamespace;
  wav: WavNamespace;
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

  function makeEndpoint<TReq, TRes>(
    path: string,
    schema: PayloadSchema
  ): SunoEndpointMethod<TReq, TRes> {
    async function call(req: TReq): Promise<TRes> {
      return kieRequest<TRes>(`${baseURL}${path}`, {
        method: "POST",
        body: req,
        ...requestOpts,
      });
    }
    return Object.assign(call, {
      payloadSchema: schema,
      validatePayload(data: unknown): ValidationResult {
        return validatePayload(data, schema);
      },
    });
  }

  async function vocalRemovalGenerate(
    req: VocalRemovalRequest
  ): Promise<VocalRemovalResponse> {
    return kieRequest<VocalRemovalResponse>(
      `${baseURL}/api/v1/vocal-removal/generate`,
      {
        method: "POST",
        body: req,
        ...requestOpts,
      }
    );
  }

  async function vocalRemovalRecordInfo(
    taskId: string
  ): Promise<VocalRemovalInfo> {
    return kieRequest<VocalRemovalInfo>(
      `${baseURL}/api/v1/vocal-removal/record-info?taskId=${encodeURIComponent(taskId)}`,
      {
        method: "GET",
        ...requestOpts,
      }
    );
  }

  async function midiGenerate(
    req: MidiGenerateRequest
  ): Promise<MidiGenerateResponse> {
    return kieRequest<MidiGenerateResponse>(`${baseURL}/api/v1/midi/generate`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  async function midiRecordInfo(taskId: string): Promise<MidiInfo> {
    return kieRequest<MidiInfo>(
      `${baseURL}/api/v1/midi/record-info?taskId=${encodeURIComponent(taskId)}`,
      {
        method: "GET",
        ...requestOpts,
      }
    );
  }

  async function wavGenerate(
    req: WavGenerateRequest
  ): Promise<WavGenerateResponse> {
    return kieRequest<WavGenerateResponse>(`${baseURL}/api/v1/wav/generate`, {
      method: "POST",
      body: req,
      ...requestOpts,
    });
  }

  async function wavRecordInfo(taskId: string): Promise<WavInfo> {
    return kieRequest<WavInfo>(
      `${baseURL}/api/v1/wav/record-info?taskId=${encodeURIComponent(taskId)}`,
      {
        method: "GET",
        ...requestOpts,
      }
    );
  }

  const generate = makeEndpoint<SunoGenerateRequest, SunoSubmitResponse>(
    "/api/v1/generate",
    sunoGenerateSchema
  );

  const generateCallable: SunoGenerateCallable = Object.assign(generate, {
    extend: makeEndpoint<SunoExtendRequest, SunoSubmitResponse>(
      "/api/v1/generate/extend",
      sunoExtendSchema
    ),
    "upload-cover": makeEndpoint<SunoUploadCoverRequest, SunoSubmitResponse>(
      "/api/v1/generate/upload-cover",
      sunoUploadCoverSchema
    ),
    "upload-extend": makeEndpoint<SunoUploadExtendRequest, SunoSubmitResponse>(
      "/api/v1/generate/upload-extend",
      sunoUploadExtendSchema
    ),
    "add-instrumental": makeEndpoint<
      SunoAddInstrumentalRequest,
      SunoSubmitResponse
    >("/api/v1/generate/add-instrumental", sunoAddInstrumentalSchema),
    "add-vocals": makeEndpoint<SunoAddVocalsRequest, SunoSubmitResponse>(
      "/api/v1/generate/add-vocals",
      sunoAddVocalsSchema
    ),
    "replace-section": makeEndpoint<
      SunoReplaceSectionRequest,
      SunoSubmitResponse
    >("/api/v1/generate/replace-section", sunoReplaceSectionSchema),
    "get-timestamped-lyrics": makeEndpoint<
      SunoTimestampedLyricsRequest,
      SunoTimestampedLyricsResponse
    >("/api/v1/generate/get-timestamped-lyrics", sunoTimestampedLyricsSchema),
    "generate-persona": makeEndpoint<
      SunoGeneratePersonaRequest,
      SunoPersonaResponse
    >("/api/v1/generate/generate-persona", sunoGeneratePersonaSchema),
    mashup: makeEndpoint<SunoMashupRequest, SunoSubmitResponse>(
      "/api/v1/generate/mashup",
      sunoMashupSchema
    ),
    sounds: makeEndpoint<SunoSoundsRequest, SunoSubmitResponse>(
      "/api/v1/generate/sounds",
      sunoSoundsSchema
    ),
  });

  return {
    api: {
      v1: {
        generate: generateCallable,
        suno: {
          cover: {
            generate: makeEndpoint<
              SunoCoverGenerateRequest,
              SunoSubmitResponse
            >("/api/v1/suno/cover/generate", sunoCoverGenerateSchema),
          },
        },
        lyrics: makeEndpoint<SunoLyricsRequest, SunoSubmitResponse>(
          "/api/v1/lyrics",
          sunoLyricsSchema
        ),
        "vocal-removal": {
          generate: Object.assign(vocalRemovalGenerate, {
            payloadSchema: vocalRemovalGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, vocalRemovalGenerateSchema);
            },
          }),
          "record-info": vocalRemovalRecordInfo,
        },
        midi: {
          generate: Object.assign(midiGenerate, {
            payloadSchema: midiGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, midiGenerateSchema);
            },
          }),
          "record-info": midiRecordInfo,
        },
        wav: {
          generate: Object.assign(wavGenerate, {
            payloadSchema: wavGenerateSchema,
            validatePayload(data: unknown): ValidationResult {
              return validatePayload(data, wavGenerateSchema);
            },
          }),
          "record-info": wavRecordInfo,
        },
      },
    },
  };
}
