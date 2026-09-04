import "server-only";
import { logger } from "@navikt/next-logger";
import z from "zod";
import {
  isTokenXExchangeError,
  validateTokenAndGetTokenX,
  validateTokenAndGetTokenXOrRedirect,
  validateTokenAndGetTokenXOrRedirectWithoutLogging,
} from "@/server/auth/tokenX";
import { logErrorMessageAndThrowError } from "@/utils/errorHandling";
import { getBackendRequestHeaders, type TokenXTargetApi } from "./helpers";
import {
  createFrontendError,
  type ErrorDetail,
  isKnownDomainRejection,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
  toFrontendError,
  toFrontendErrorResponse,
} from "./narmesteLederErrorUtils";
import {
  getRuntimeErrorMessage,
  RuntimeErrorCode,
  type RuntimeErrorOperation,
  runtimeErrorContext,
} from "./observability/runtimeErrorContract";

const createSafeFrontendError = () =>
  createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);

const logGetFailure = (
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  upstreamStatus?: number,
): void => {
  logger.error(
    runtimeErrorContext(operation, errorCode, upstreamStatus),
    getRuntimeErrorMessage(operation),
  );
};

const logGetResponseValidationFailure = (
  operation: RuntimeErrorOperation,
  validationError: z.ZodError,
): void => {
  logger.error(
    {
      ...runtimeErrorContext(operation, RuntimeErrorCode.INVALID_RESPONSE),
      validation_target: "upstream_response",
      validationIssues: z.prettifyError(validationError),
    },
    getRuntimeErrorMessage(operation),
  );
};

const parseAndValidateGetResponse = async <S extends z.ZodTypeAny>(
  response: Response,
  responseDataSchema: S,
  operation: RuntimeErrorOperation,
): Promise<z.infer<S>> => {
  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    logGetFailure(operation, RuntimeErrorCode.INVALID_JSON);
    throw createSafeFrontendError();
  }

  const result = responseDataSchema.safeParse(responseData);
  if (!result.success) {
    logGetResponseValidationFailure(operation, result.error);
    throw createSafeFrontendError();
  }

  return result.data;
};

const readJsonBody = async (
  response: Response,
  endpoint: string,
): Promise<unknown> => {
  try {
    return await response.json();
  } catch (error) {
    logErrorMessageAndThrowError(
      `Failed to parse response as JSON from ${endpoint}: ${error}`,
    );
  }
};

const validateResponse = <S extends z.ZodTypeAny>(
  responseData: unknown,
  endpoint: string,
  responseDataSchema: S,
): z.infer<S> => {
  const result = responseDataSchema.safeParse(responseData);
  if (result.success) {
    return result.data;
  }
  logger.error(
    { validationIssues: z.prettifyError(result.error), endpoint },
    "[Backend] payload validation failed for response from endpoint",
  );
  throw new Error("Det oppstod en feil ved henting av data.");
};

const parseAndValidateResponse = async <S extends z.ZodTypeAny>(
  response: Response,
  endpoint: string,
  responseDataSchema: S,
): Promise<z.infer<S>> => {
  const responseData = await readJsonBody(response, endpoint);

  return validateResponse(responseData, endpoint, responseDataSchema);
};

export async function tokenXFetchGet<S extends z.ZodType>({
  targetApi,
  operation,
  endpoint,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
  targetApi: TokenXTargetApi;
  operation: RuntimeErrorOperation;
  endpoint: string;
  responseDataSchema: S;
  redirectAfterLoginUrl: string;
}): Promise<z.infer<S>> {
  let oboToken: string;
  try {
    oboToken = await validateTokenAndGetTokenXOrRedirectWithoutLogging(
      redirectAfterLoginUrl,
      targetApi,
    );
  } catch (error) {
    if (!isTokenXExchangeError(error)) {
      throw error;
    }
    logGetFailure(operation, RuntimeErrorCode.TOKEN_EXCHANGE_FAILED);
    throw createSafeFrontendError();
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: getBackendRequestHeaders(oboToken),
    });
  } catch {
    logGetFailure(operation, RuntimeErrorCode.NETWORK_ERROR);
    throw createSafeFrontendError();
  }

  if (!response.ok) {
    const frontendErrorResponse = await toFrontendErrorResponse(response);
    if (
      !isKnownDomainRejection(
        operation,
        response.status,
        frontendErrorResponse.type,
      )
    ) {
      logGetFailure(
        operation,
        RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        response.status,
      );
    }
    throw createFrontendError(frontendErrorResponse.errorDetail);
  }

  return parseAndValidateGetResponse(response, responseDataSchema, operation);
}

export async function tokenXFetchPost<S extends z.ZodType>({
  targetApi,
  endpoint,
  requestBody,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
  targetApi: TokenXTargetApi;
  endpoint: string;
  requestBody: unknown;
  responseDataSchema: S;
  redirectAfterLoginUrl: string;
}): Promise<z.infer<S>> {
  const oboToken = await validateTokenAndGetTokenXOrRedirect(
    redirectAfterLoginUrl,
    targetApi,
  );

  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: getBackendRequestHeaders(oboToken),
  });

  if (!response.ok) {
    const frontendError = await toFrontendError(response);
    logErrorMessageAndThrowError(
      `Fetch failed: method=POST endpoint=${endpoint} status=${response.status} ${response.statusText}`,
      frontendError,
    );
  }

  return parseAndValidateResponse(response, endpoint, responseDataSchema);
}

export type TokenXFetchUpdateResult =
  | { success: true }
  | {
      success: false;
      errorDetail: ErrorDetail;
    };

export async function tokenXFetchUpdate({
  targetApi,
  endpoint,
  requestBody,
  method = "POST",
}: {
  targetApi: TokenXTargetApi;
  endpoint: string;
  requestBody: unknown;
  method?: "POST" | "PUT" | "DELETE";
}): Promise<TokenXFetchUpdateResult> {
  const oboToken = await validateTokenAndGetTokenX(targetApi);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      body: JSON.stringify(requestBody),
      headers: getBackendRequestHeaders(oboToken),
    });
    if (response.ok) {
      return { success: true };
    }
  } catch (error) {
    logErrorMessageAndThrowError(
      `Fetch failed: method=${method} endpoint=${endpoint} - network error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const frontendErrorResponse = await toFrontendErrorResponse(response);

  logger.warn(
    `Fetch failed: method=${method} endpoint=${endpoint} status=${response.status} ${response.statusText} backendErrorType=${frontendErrorResponse?.type}`,
  );

  return {
    success: false,
    errorDetail: frontendErrorResponse.errorDetail,
  };
}
