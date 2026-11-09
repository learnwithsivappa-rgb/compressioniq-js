import { Buffer } from "node:buffer";

import {
  HttpClient
} from "../utils/http.js";

import {
  ValidationError
} from "../errors.js";

export class FilesResource {
  constructor(
    private readonly http: HttpClient
  ) {}

  async download(
    filename: string
  ): Promise<Uint8Array> {

    if (!filename || !filename.trim()) {
      throw new ValidationError("Filename is required.");
    }

    return this.http.requestBinary(
      `/api/v1/files/${encodeURIComponent(filename)}`
    );
  }

  async downloadToBuffer(
    filename: string
  ): Promise<Buffer> {

    const data = await this.download(filename);

    return Buffer.from(data);
  }
}
