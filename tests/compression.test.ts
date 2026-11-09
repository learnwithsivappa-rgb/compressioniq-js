import {
  describe,
  it,
  expect,
  vi,
  afterEach
} from "vitest";

import {
  CompressionIQ,
  ValidationError
} from "../src/index.js";

describe("Compression Resource", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should submit an image successfully", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "accepted",
          job_id: "test-job-123"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    );

    vi.stubGlobal("fetch", mockFetch);

    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const image = new Blob(
      ["test-image-content"],
      {
        type: "image/png"
      }
    );

    const result = await client.compression.create(
      image,
      {
        filename: "test.png",
        format: "webp",
        mode: "balanced"
      }
    );

    expect(result.status).toBe("accepted");
    expect(result.job_id).toBe("test-job-123");

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toContain("/api/v1/compress");

    expect(
      (options as RequestInit).method
    ).toBe("POST");

    const headers = new Headers(
      (options as RequestInit).headers
    );

    expect(headers.get("x-api-key")).toBe("test-api-key");

    expect(
      (options as RequestInit).body
    ).toBeInstanceOf(FormData);
  });

  it("should reject an empty image", async () => {
    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const emptyImage = new Blob([]);

    await expect(
      client.compression.create(emptyImage)
    ).rejects.toThrow(ValidationError);
  });

  it("should reject an invalid custom width", async () => {
    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const image = new Blob(["image"]);

    await expect(
      client.compression.create(image, {
        customWidth: -100
      })
    ).rejects.toThrow(ValidationError);
  });
});
