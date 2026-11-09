import {
  describe,
  it,
  expect,
  vi,
  afterEach
} from "vitest";

import {
  CompressionIQ,
  AuthenticationError,
  APIError
} from "../src/index.js";

describe("HTTP Client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should handle authentication failures", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          detail: "Invalid API key"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    );

    vi.stubGlobal("fetch", mockFetch);

    const client = new CompressionIQ({
      apiKey: "invalid-key"
    });

    const image = new Blob(["test-image"]);

    await expect(
      client.compression.create(image)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should handle server errors", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          detail: "Internal server error"
        }),
        {
          status: 500,
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

    const image = new Blob(["test-image"]);

    await expect(
      client.compression.create(image)
    ).rejects.toThrow(APIError);
  });

  it("should handle network failures", async () => {
    const mockFetch = vi.fn().mockRejectedValue(
      new TypeError("Failed to fetch")
    );

    vi.stubGlobal("fetch", mockFetch);

    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    const image = new Blob(["test-image"]);

    await expect(
      client.compression.create(image)
    ).rejects.toThrow("Failed to fetch");
  });
});
