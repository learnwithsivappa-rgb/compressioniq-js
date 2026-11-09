import {
  HttpClient
} from "../utils/http.js";

export class FilesResource {
  constructor(
    private readonly http: HttpClient
  ) {}

  async download(
    filename: string
  ): Promise<Uint8Array> {

    if (!filename || !filename.trim()) {
      throw new Error("Filename is required.");
    }

    return this.http.requestBinary(
      `/api/v1/files/${encodeURIComponent(filename)}`
    );
  }
}
