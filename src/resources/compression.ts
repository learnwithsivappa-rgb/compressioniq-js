import { Buffer } from "node:buffer";

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
    file: Blob | Buffer | Uint8Array,
    options: CompressionOptions = {}
  ): Promise<CompressionAcceptedResponse> {

    let imageBlob: Blob;

    if (file instanceof Blob) {
      imageBlob = file;
    } else if (
      Buffer.isBuffer(file) ||
      file instanceof Uint8Array
    ) {
      const copy = Uint8Array.from(file);

      imageBlob = new Blob(
        [copy.buffer as ArrayBuffer]
      );
    } else {
      throw new Error("Unsupported image input.");
    }

    validateImageFile(imageBlob);
    validateCompressionOptions(options);

    const formData = new FormData();

    formData.append(
      "file",
      imageBlob,
      options.filename ?? "image.bin"
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
