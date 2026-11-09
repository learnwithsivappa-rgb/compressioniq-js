import type {
  CompressionOptions,
  CompressionAcceptedResponse
} from "../types.js";

import {
  validateCompressionOptions,
  validateImageFile
} from "../utils/validation.js";

import {
  HttpClient
} from "../utils/http.js";

export class CompressionResource {
  constructor(
    private readonly http: HttpClient
  ) {}

  async create(
    file: Blob,
    options: CompressionOptions = {}
  ): Promise<CompressionAcceptedResponse> {

    validateImageFile(file);
    validateCompressionOptions(options);

    const formData = new FormData();

    const filename =
      options.filename ?? "image.bin";

    formData.append(
      "file",
      file,
      filename
    );

    if (options.format !== undefined) {
      formData.append("format", options.format);
    }

    if (options.mode !== undefined) {
      formData.append("mode", options.mode);
    }

    if (options.resize !== undefined) {
      formData.append("resize", options.resize);
    }

    if (options.customWidth !== undefined) {
      formData.append(
        "custom_width",
        String(options.customWidth)
      );
    }

    return this.http.request<CompressionAcceptedResponse>(
      "/api/v1/compress",
      {
        method: "POST",
        body: formData
      }
    );
  }
                      }
