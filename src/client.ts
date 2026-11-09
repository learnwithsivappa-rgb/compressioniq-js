import {
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT
} from "./config.js";

import type {
  CompressionIQConfig
} from "./types.js";

import {
  validateConfig
} from "./utils/validation.js";

import {
  HttpClient
} from "./utils/http.js";

import {
  CompressionResource
} from "./resources/compression.js";

export class CompressionIQ {
  public readonly compression: CompressionResource;

  private readonly http: HttpClient;

  constructor(config: CompressionIQConfig) {
    validateConfig(config);

    const baseURL =
      config.baseURL ?? DEFAULT_BASE_URL;

    const timeout =
      config.timeout ?? DEFAULT_TIMEOUT;

    this.http = new HttpClient(
      config.apiKey,
      baseURL,
      timeout
    );

    this.compression = new CompressionResource(
      this.http
    );
  }
}
