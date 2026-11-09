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

import {
  JobsResource
} from "./resources/jobs.js";

import {
  FilesResource
} from "./resources/files.js";

export class CompressionIQ {
  public readonly compression: CompressionResource;

  public readonly jobs: JobsResource;

  public readonly files: FilesResource;

  constructor(config: CompressionIQConfig) {
    validateConfig(config);

    const baseURL =
      config.baseURL ?? DEFAULT_BASE_URL;

    const timeout =
      config.timeout ?? DEFAULT_TIMEOUT;

    const http = new HttpClient(
      config.apiKey,
      baseURL,
      timeout
    );

    this.compression = new CompressionResource(http);

    this.jobs = new JobsResource(http);

    this.files = new FilesResource(http);
  }
}
