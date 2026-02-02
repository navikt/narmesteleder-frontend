import { logger } from "@navikt/next-logger";

/**
 * Logs a successful API call with timing information
 */
export function logApiSuccess(
  method: string,
  endpoint: string,
  status: number,
  durationMs: number,
): void {
  logger.info(
    {
      operation: method,
      endpoint,
      status,
      durationMs,
    },
    `${method} request succeeded`,
  );
}

/**
 * Logs an API error with appropriate log level based on status code
 * - 4xx errors: warning level (client/validation errors)
 * - 5xx errors: error level (server errors)
 */
export function logApiError(
  method: string,
  endpoint: string,
  status: number,
  statusText: string,
  durationMs: number,
  backendErrorType?: string,
): void {
  const logLevel = status >= 500 ? logger.error : logger.warn;

  logLevel.call(
    logger,
    {
      operation: method,
      endpoint,
      status,
      statusText,
      durationMs,
      ...(backendErrorType && { backendErrorType }),
    },
    `${method} request failed`,
  );
}

/**
 * Logs a network error
 */
export function logApiNetworkError(
  method: string,
  endpoint: string,
  durationMs: number,
  error: unknown,
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);

  logger.error(
    {
      operation: method,
      endpoint,
      error: errorMessage,
      durationMs,
    },
    `${method} request failed - network error`,
  );
}

/**
 * Logs a parse error (JSON or Zod validation)
 */
export function logApiParseError(
  endpoint: string,
  parseType: "json" | "zod",
  error: unknown,
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);

  logger.error(
    {
      endpoint,
      parseType,
      error: errorMessage,
    },
    `Failed to parse response${parseType === "json" ? " as JSON" : " with schema"}`,
  );
}

/**
 * Generic error logging for non-API errors (authentication, validation, etc.)
 */
export function logError(
  context: Record<string, unknown>,
  message: string,
): void {
  logger.error(context, message);
}
