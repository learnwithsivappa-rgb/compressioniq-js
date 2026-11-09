import type {
  CompressionJobResponse
} from "../types.js";

import {
  HttpClient
} from "../utils/http.js";

import {
  ValidationError,
  TimeoutError
} from "../errors.js";

export interface JobPollingOptions {
  intervalMs?: number;
  timeoutMs?: number;
}

export class JobsResource {
  constructor(
    private readonly http: HttpClient
  ) {}

  async get(
    jobId: string
  ): Promise<CompressionJobResponse> {

    if (!jobId || !jobId.trim()) {
      throw new ValidationError("Job ID is required.");
    }

    return this.http.request<CompressionJobResponse>(
      `/api/v1/job/${encodeURIComponent(jobId)}`,
      {
        method: "GET"
      }
    );
  }

  async wait(
    jobId: string,
    options: JobPollingOptions = {}
  ): Promise<CompressionJobResponse> {

    const intervalMs = options.intervalMs ?? 1000;
    const timeoutMs = options.timeoutMs ?? 60000;

    if (intervalMs <= 0 || timeoutMs <= 0) {
      throw new ValidationError(
        "Polling interval and timeout must be positive."
      );
    }

    const startTime = Date.now();

    while (true) {
      const job = await this.get(jobId);

      const status = job.status.toLowerCase();

      if (
        ["completed", "failed", "error", "cancelled"].includes(status)
      ) {
        return job;
      }

      if (Date.now() - startTime >= timeoutMs) {
        throw new TimeoutError(
          `Job ${jobId} did not finish within ${timeoutMs}ms.`
        );
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, intervalMs);
      });
    }
  }
}
