import {
  DEFAULT_HEADERS
} from "../config.js";

import {
  APIError,
  AuthenticationError,
  NetworkError,
  TimeoutError
} from "../errors.js";

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly timeout: number;

  constructor(
    apiKey: string,
    baseURL: string,
    timeout: number
  ) {
    this.apiKey = apiKey;
    this.baseURL = baseURL.replace(/\/+$/, "");
    this.timeout = timeout;
  }

  private createHeaders(
    customHeaders?: HeadersInit
  ): Headers {
    const headers = new Headers(customHeaders);

    headers.set("x-api-key", this.apiKey);

    for (const [key, value] of Object.entries(DEFAULT_HEADERS)) {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    }

    return headers;
  }

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeout
    );

    try {
      const response = await fetch(
        `${this.baseURL}${path}`,
        {
          ...options,
          headers: this.createHeaders(options.headers),
          signal: controller.signal
        }
      );

      const responseText = await response.text();

      let data: unknown;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = responseText;
      }

      if (!response.ok) {
        this.handleError(response.status, data);
      }

      return data as T;

    } catch (error) {
      this.handleNetworkError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async requestBinary(
    path: string
  ): Promise<Uint8Array> {
    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeout
    );

    try {
      const response = await fetch(
        `${this.baseURL}${path}`,
        {
          method: "GET",
          headers: this.createHeaders({
            Accept: "application/octet-stream"
          }),
          signal: controller.signal
        }
      );

      if (!response.ok) {
        const responseText = await response.text();

        let data: unknown;

        try {
          data = responseText
            ? JSON.parse(responseText)
            : {};
        } catch {
          data = responseText;
        }

        this.handleError(response.status, data);
      }

      return new Uint8Array(
        await response.arrayBuffer()
      );

    } catch (error) {
      this.handleNetworkError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private handleError(
    statusCode: number,
    data: unknown
  ): never {
    const errorData =
      typeof data === "object" && data !== null
        ? data as Record<string, unknown>
        : {};

    const message = String(
      errorData.detail ??
      errorData.message ??
      errorData.error ??
      `API request failed with status ${statusCode}.`
    );

    if (statusCode === 401 || statusCode === 403) {
      throw new AuthenticationError(message);
    }

    throw new APIError(
      message,
      statusCode,
      data
    );
  }

  private handleNetworkError(
    error: unknown
  ): never {
    if (
      error instanceof APIError ||
      error instanceof AuthenticationError ||
      error instanceof TimeoutError ||
      error instanceof NetworkError
    ) {
      throw error;
    }

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new TimeoutError();
    }

    throw new NetworkError(
      error instanceof Error
        ? error.message
        : "Unknown network error."
    );
  }
}
