export type CompressionFormat = string;

export type CompressionMode = string;

export type ResizeOption = string;

export interface CompressionIQConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface CompressionOptions {
  filename?: string;
  format?: CompressionFormat;
  mode?: CompressionMode;
  resize?: ResizeOption;
  customWidth?: number;
}

export interface CompressionAcceptedResponse {
  status: "accepted";
  job_id: string;
  [key: string]: unknown;
}

export interface CompressionJobResponse {
  status: string;
  job_id?: string;
  [key: string]: unknown;
}

export interface CompressionResult {
  submission: CompressionAcceptedResponse;
  job: CompressionJobResponse;
}

export interface CompressionIQErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}
