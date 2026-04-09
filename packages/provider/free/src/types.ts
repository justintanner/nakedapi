// ---------------------------------------------------------------------------
// @nakedapi/free – free file hosting providers (tmpfiles.org, uguu.se)
// ---------------------------------------------------------------------------

// -- Options ----------------------------------------------------------------

export interface FreeOptions {
  timeout?: number;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

// -- Tmpfiles.org types -----------------------------------------------------

export interface TmpfilesUploadRequest {
  file: Blob;
  filename?: string;
}

export interface TmpfilesUploadData {
  url: string;
}

export interface TmpfilesUploadResponse {
  status: string;
  data: TmpfilesUploadData;
}

// -- Uguu.se types ----------------------------------------------------------

export interface UguuUploadRequest {
  file: Blob;
  filename?: string;
}

export interface UguuFileEntry {
  hash: string;
  filename: string;
  url: string;
  size: number;
  dupe: boolean;
}

export interface UguuUploadResponse {
  success: boolean;
  files: UguuFileEntry[];
}

// -- Error ------------------------------------------------------------------

export class FreeError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "FreeError";
    this.status = status;
    this.body = body ?? null;
  }
}

// -- Payload validation types -----------------------------------------------

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

// -- Method interfaces ------------------------------------------------------

export interface TmpfilesUploadMethod {
  (
    req: TmpfilesUploadRequest,
    signal?: AbortSignal
  ): Promise<TmpfilesUploadResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

export interface UguuUploadMethod {
  (req: UguuUploadRequest, signal?: AbortSignal): Promise<UguuUploadResponse>;
  payloadSchema: PayloadSchema;
  validatePayload(data: unknown): ValidationResult;
}

// -- Namespace interfaces ---------------------------------------------------

export interface TmpfilesApiV1Namespace {
  upload: TmpfilesUploadMethod;
}

export interface TmpfilesApiNamespace {
  v1: TmpfilesApiV1Namespace;
}

export interface TmpfilesNamespace {
  api: TmpfilesApiNamespace;
}

export interface UguuNamespace {
  upload: UguuUploadMethod;
}

export interface FreeProvider {
  tmpfiles: TmpfilesNamespace;
  uguu: UguuNamespace;
}
