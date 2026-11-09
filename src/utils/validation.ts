import type {
  CompressionIQConfig,
  CompressionOptions
} from "../types.js";

import { ValidationError } from "../errors.js";

export function validateConfig(
  config: CompressionIQConfig
): void {
  if (!config.apiKey || !config.apiKey.trim()) {
    throw new ValidationError("API key is required.");
  }

  if (config.baseURL !== undefined) {
    try {
      new URL(config.baseURL);
    } catch {
      throw new ValidationError("Invalid API base URL.");
    }
  }

  if (
    config.timeout !== undefined &&
    (!Number.isFinite(config.timeout) || config.timeout <= 0)
  ) {
    throw new ValidationError(
      "Timeout must be a positive number."
    );
  }
}

export function validateCompressionOptions(
  options: CompressionOptions
): void {
  if (
    options.customWidth !== undefined &&
    (
      !Number.isInteger(options.customWidth) ||
      options.customWidth <= 0
    )
  ) {
    throw new ValidationError(
      "customWidth must be a positive integer."
    );
  }

  for (const field of ["format", "mode", "resize"] as const) {
    const value = options[field];

    if (value !== undefined && !value.trim()) {
      throw new ValidationError(
        `${field} cannot be an empty string.`
      );
    }
  }
}

export function validateImageFile(file: Blob): void {
  if (!(file instanceof Blob)) {
    throw new ValidationError(
      "A valid Blob image file is required."
    );
  }

  if (file.size === 0) {
    throw new ValidationError(
      "The image file cannot be empty."
    );
  }
}
