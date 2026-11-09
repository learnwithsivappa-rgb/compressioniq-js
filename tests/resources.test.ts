import {
  describe,
  it,
  expect,
  vi,
  afterEach
} from "vitest";

import { Buffer } from "node:buffer";

import {
  CompressionIQ
} from "../src/index.js";

describe("CompressionIQ Resources", () => {

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should accept Node.js Buffer uploads", async () => {

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "accepted",
          job_id: "buffer-job-123"
        }),
        {
          status: 200
        }
      )
    );

    vi.stubGlobal("fetch", mockFetch);

    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const imageBuffer = Buffer.from("test-image");

    const result = await client.compression.create(
      imageBuffer,
      {
        filename: "buffer.png",
        format: "webp"
      }
    );

    expect(result.job_id).toBe("buffer-job-123");

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should retrieve job status", async () => {

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "completed",
          job_id: "job-123"
        }),
        {
          status: 200
        }
      )
    );

    vi.stubGlobal("fetch", mockFetch);

    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const result = await client.jobs.get("job-123");

    expect(result.status).toBe("completed");
    expect(result.job_id).toBe("job-123");
  });

  it("should wait for job completion", async () => {

    const mockFetch = vi.fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "processing",
            job_id: "job-456"
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "completed",
            job_id: "job-456"
          }),
          { status: 200 }
        )
      );

    vi.stubGlobal("fetch", mockFetch);

    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const result = await client.jobs.wait(
      "job-456",
      {
        intervalMs: 10,
        timeoutMs: 5000
      }
    );

    expect(result.status).toBe("completed");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should download files as Buffer", async () => {

    const fileContent = new Uint8Array([
      1, 2, 3, 4, 5
    ]);

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(fileContent, {
        status: 200
      })
    );

    vi.stubGlobal("fetch", mockFetch);

    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const result = await client.files.downloadToBuffer(
      "compressed.webp"
    );

    expect(Buffer.isBuffer(result)).toBe(true);

    expect([...result]).toEqual([
      1, 2, 3, 4, 5
    ]);
  });
});
