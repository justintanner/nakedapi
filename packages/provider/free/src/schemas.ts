import type { PayloadSchema } from "./types";

export const tmpfilesUploadSchema: PayloadSchema = {
  method: "POST",
  path: "/api/v1/upload",
  contentType: "multipart/form-data",
  fields: {
    file: {
      type: "object",
      required: true,
      description:
        "The file to upload (Blob or File). Auto-deleted after 60 minutes.",
    },
    filename: {
      type: "string",
      description: "Optional filename for the upload (defaults to 'upload').",
    },
  },
};

export const uguuUploadSchema: PayloadSchema = {
  method: "POST",
  path: "/upload",
  contentType: "multipart/form-data",
  fields: {
    file: {
      type: "object",
      required: true,
      description:
        "The file to upload (Blob or File). 128 MiB max. Expires after 3 hours.",
    },
    filename: {
      type: "string",
      description: "Optional filename for the upload (defaults to 'upload').",
    },
  },
};
