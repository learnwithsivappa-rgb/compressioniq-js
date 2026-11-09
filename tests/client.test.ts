import { describe, it, expect } from "vitest";

import {
  CompressionIQ,
  ValidationError
} from "../src/index.js";

describe("CompressionIQ Client", () => {
  it("should initialize with a valid API key", () => {
    const client = new CompressionIQ({
      apiKey: "test-api-key"
    });

    expect(client).toBeDefined();
    expect(client.compression).toBeDefined();
    expect(client.jobs).toBeDefined();
    expect(client.files).toBeDefined();
  });

  it("should reject an empty API key", () => {
    expect(() => {
      new CompressionIQ({
        apiKey: ""
      });
    }).toThrow(ValidationError);
  });

  it("should reject an invalid base URL", () => {
    expect(() => {
      new CompressionIQ({
        apiKey: "test-api-key",
        baseURL: "invalid-url"
      });
    }).toThrow(ValidationError);
  });

  it("should reject an invalid timeout", () => {
    expect(() => {
      new CompressionIQ({
        apiKey: "test-api-key",
        timeout: -100
      });
    }).toThrow(ValidationError);
  });
});
