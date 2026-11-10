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

    // 1. Normalize image input
    let imageBlob: Blob;

    if (file instanceof Blob) {
      imageBlob = file;
    } else if (
      Buffer.isBuffer(file) ||
      file instanceof Uint8Array
    ) {
      const copy = Uint8Array.from(file);

      imageBlob = new Blob([copy.buffer]);
    } else {
      throw new Error("Unsupported image input.");
    }

    // 2. Validate image and options
    validateImageFile(imageBlob);
    validateCompressionOptions(options);

    // 3. Build URL query parameters
    const query = new URLSearchParams();

    if (options.format !== undefined) {
      query.set("format", options.format);
    }

    if (options.mode !== undefined) {
      query.set("mode", options.mode);
    }

    if (options.resize !== undefined) {
      query.set("resize", options.resize);
    }

    if (options.customWidth !== undefined) {
      query.set(
        "custom_width",
        String(options.customWidth)
      );
    }

    // 4. Construct endpoint
    const queryString = query.toString();

    const endpoint = queryString
      ? `/api/v1/compress?${queryString}`
      : "/api/v1/compress";

    // 5. Multipart body contains ONLY the image
    const formData = new FormData();

    formData.append(
      "file",
      imageBlob,
      options.filename ?? "image.bin"
    );

    // 6. Submit compression request
    return this.http.request<CompressionAcceptedResponse>(
      endpoint,
      {
        method: "POST",
        body: formData
      }
    );
  }
}
