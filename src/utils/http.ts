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

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeout
    );

    const headers = new Headers(options.headers);

    headers.set("x-api-key", this.apiKey);

    for (const [key, value] of Object.entries(DEFAULT_HEADERS)) {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    }

    try {
      const response = await fetch(
        `${this.baseURL}${path}`,
        {
          ...options,
          headers,
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
        const errorData =
          typeof data === "object" && data !== null
            ? data as Record<string, unknown>
            : {};

        const message = String(
          errorData.detail ??
          errorData.message ??
          errorData.error ??
          `API request failed with status ${response.status}.`
        );

        if (response.status === 401 || response.status === 403) {
          throw new AuthenticationError(message);
        }

        throw new APIError(
          message,
          response.status,
          data
        );
      }

      return data as T;

    } catch (error) {
      if (
        error instanceof APIError ||
        error instanceof AuthenticationError
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

    } finally {
      clearTimeout(timeoutId);
    }
  }
        }
