import type {
  CompressionJobResponse
} from "../types.js";

import {
  HttpClient
} from "../utils/http.js";

export class JobsResource {
  constructor(
    private readonly http: HttpClient
  ) {}

  async get(
    jobId: string
  ): Promise<CompressionJobResponse> {

    if (!jobId || !jobId.trim()) {
      throw new Error("Job ID is required.");
    }

    return this.http.request<CompressionJobResponse>(
      `/api/v1/job/${encodeURIComponent(jobId)}`,
      {
        method: "GET"
      }
    );
  }
}
