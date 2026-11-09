export { CompressionIQ } from "./client.js";

export {
  CompressionIQError,
  AuthenticationError,
  ValidationError,
  APIError,
  TimeoutError,
  NetworkError
} from "./errors.js";

export {
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT,
  SDK_VERSION
} from "./config.js";

export type {
  CompressionIQConfig,
  CompressionOptions,
  CompressionFormat,
  CompressionMode,
  ResizeOption,
  CompressionAcceptedResponse,
  CompressionJobResponse,
  CompressionResult,
  CompressionIQErrorResponse
} from "./types.js";
