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
  vocalRemovalGenerateSchema,
  midiGenerateSchema,
  wavGenerateSchema,
} from "./schemas";
import { validatePayload } from "./validate";

export type SunoModel = "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5";

export interface SunoGenerateRequest {
  prompt: string;
  model: SunoModel;
  instrumental: boolean;
  customMode: boolean;
  style?: string;
  negativeTags?: string;
  title?: string;
}

interface SunoSubmitResponse {
  code: number;
  msg?: string;
  data?: {
    taskId?: string;
  };
}

interface SunoGenerateMethod {
  (req: SunoGenerateRequest): Promise<SunoSubmitResponse>;
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

interface SunoV1Namespace {
  generate: SunoGenerateMethod;
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

  async function createTask(
    req: SunoGenerateRequest
  ): Promise<SunoSubmitResponse> {
    return kieRequest<SunoSubmitResponse>(`${baseURL}/api/v1/generate`, {
      method: "POST",
      body: req,
      ...requestOpts,
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

  return {
    api: {
      v1: {
        generate: Object.assign(createTask, {
          payloadSchema: sunoGenerateSchema,
          validatePayload(data: unknown): ValidationResult {
            return validatePayload(data, sunoGenerateSchema);
          },
        }),
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
