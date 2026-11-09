export class CompressionIQError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      code?: string;
      details?: unknown;
    }
  ) {
    super(message);

    this.name = "CompressionIQError";
    this.statusCode = options?.statusCode;
    this.code = options?.code;
    this.details = options?.details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends CompressionIQError {
  constructor(message = "Invalid or missing API key.") {
    super(message, {
      statusCode: 401,
      code: "AUTHENTICATION_ERROR"
    });

    this.name = "AuthenticationError";
  }
}

export class ValidationError extends CompressionIQError {
  constructor(
    message: string,
    details?: unknown
  ) {
    super(message, {
      statusCode: 422,
      code: "VALIDATION_ERROR",
      details
    });

    this.name = "ValidationError";
  }
}

export class APIError extends CompressionIQError {
  constructor(
    message: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message, {
      statusCode,
      code: "API_ERROR",
      details
    });

    this.name = "APIError";
  }
}

export class TimeoutError extends CompressionIQError {
  constructor(message = "The request timed out.") {
    super(message, {
      code: "TIMEOUT_ERROR"
    });

    this.name = "TimeoutError";
  }
}

export class NetworkError extends CompressionIQError {
  constructor(message = "Unable to connect to CompressionIQ API.") {
    super(message, {
      code: "NETWORK_ERROR"
    });

    this.name = "NetworkError";
  }
                          }
