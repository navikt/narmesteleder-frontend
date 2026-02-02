import { logger } from "@navikt/next-logger";
import { ZodError } from "zod";
import {
  type FrontendErrorResponse,
  isFrontendError,
} from "@/server/narmesteLederErrorUtils";

type ApiLogParams = {
  method: string;
  endpoint: string;
  status: number;
  durationMs: number;
};

type ApiErrorParams = ApiLogParams & {
  error: Error | FrontendErrorResponse | unknown;
};

const LOG_TEMPLATES = {
  apiSuccess: (method: string) => `${method} request succeeded`,
  backendError: (method: string) => `${method} request failed`,
  network: (method: string) => `${method} request failed - network error`,
  parsingError: () => "Failed to parse response as JSON",
  schemaValidation: () => "Failed to validate schema",
  genericError: (message: string) => message,
} as const;

const getBaseLogContext = (params: ApiLogParams) => ({
  operation: params.method,
  endpoint: params.endpoint,
  status: params.status,
  durationMs: params.durationMs,
});

const extractError = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const extractZodErrorDetails = (error: unknown) => {
  if (error instanceof ZodError) {
    return {
      issues: error.issues.map((issue) => {
        const base = {
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        };

        if (
          issue.code === "invalid_type" &&
          "expected" in issue &&
          "received" in issue
        ) {
          return {
            ...base,
            expected: issue.expected,
            received: issue.received,
          };
        }

        return base;
      }),
      issueCount: error.issues.length,
    };
  }

  return { error: String(error) };
};

export const logApiSuccess = (params: ApiLogParams): void => {
  logger.info(
    getBaseLogContext(params),
    LOG_TEMPLATES.apiSuccess(params.method),
  );
};

export const logNetworkError = (params: ApiErrorParams): void => {
  logger.error(
    {
      ...getBaseLogContext(params),
      error: extractError(params.error),
    },
    LOG_TEMPLATES.network(params.method),
  );
};

export const logBackendError = (params: ApiErrorParams): void => {
  const error =
    params.error instanceof Error
      ? params.error.message
      : isFrontendError(params.error)
        ? params.error
        : String(params.error);

  const context = {
    ...getBaseLogContext(params),
    error,
  };
  if (isFrontendError(params.error)) {
    logger.warn(context, LOG_TEMPLATES.backendError(params.method));
    return;
  }
  logger.error(context, LOG_TEMPLATES.backendError(params.method));
};

export const logSchemaValidationError = (error: unknown): void => {
  logger.error(
    {
      ...extractZodErrorDetails(error),
    },
    LOG_TEMPLATES.schemaValidation(),
  );
};

export const logParseError = (error: unknown): void => {
  logger.error(
    {
      error: extractError(error),
    },
    LOG_TEMPLATES.parsingError(),
  );
};

export const logError = (message: string): void => {
  logger.error(LOG_TEMPLATES.genericError(message));
};
