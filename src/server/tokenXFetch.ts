import "server-only";
import type z from "zod";
import {
  isIdPortenTokenValidationError,
  isTokenXExchangeError,
  validateTokenAndGetTokenXOrRedirectWithoutLogging,
  validateTokenAndGetTokenXWithoutLogging,
} from "@/server/auth/tokenX";
import { getBackendRequestHeaders, type TokenXTargetApi } from "./helpers";
import {
  createFrontendError,
  type ErrorDetail,
  isKnownDomainRejection,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
  toFrontendErrorResponse,
} from "./narmesteLederErrorUtils";
import {
  RuntimeErrorCode,
  type RuntimeErrorOperation,
} from "./observability/runtimeErrorContract";
import {
  logRuntimeError,
  logRuntimeValidationError,
  RuntimeValidationTarget,
} from "./observability/runtimeErrorLogger";

const createSafeFrontendError = () =>
  createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);

const getTokenXOrRedirect = async (
  redirectAfterLoginUrl: string,
  targetApi: TokenXTargetApi,
  operation: RuntimeErrorOperation,
): Promise<string> => {
  try {
    return await validateTokenAndGetTokenXOrRedirectWithoutLogging(
      redirectAfterLoginUrl,
      targetApi,
    );
  } catch (error) {
    if (isIdPortenTokenValidationError(error)) {
      logRuntimeError(operation, RuntimeErrorCode.TOKEN_VALIDATION_FAILED);
    } else if (isTokenXExchangeError(error)) {
      logRuntimeError(operation, RuntimeErrorCode.TOKEN_EXCHANGE_FAILED);
    } else {
      throw error;
    }
    throw createSafeFrontendError();
  }
};

const parseAndValidateResponse = async <S extends z.ZodTypeAny>(
  response: Response,
  responseDataSchema: S,
  operation: RuntimeErrorOperation,
): Promise<z.infer<S>> => {
  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    logRuntimeError(operation, RuntimeErrorCode.INVALID_JSON);
    throw createSafeFrontendError();
  }

  const result = responseDataSchema.safeParse(responseData);
  if (!result.success) {
    logRuntimeValidationError(
      operation,
      RuntimeErrorCode.INVALID_RESPONSE,
      RuntimeValidationTarget.UPSTREAM_RESPONSE,
      result.error,
    );
    throw createSafeFrontendError();
  }

  return result.data;
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
  const oboToken = await getTokenXOrRedirect(
    redirectAfterLoginUrl,
    targetApi,
    operation,
  );

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: getBackendRequestHeaders(oboToken),
    });
  } catch {
    logRuntimeError(operation, RuntimeErrorCode.NETWORK_ERROR);
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
      logRuntimeError(
        operation,
        RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        response.status,
      );
    }
    throw createFrontendError(frontendErrorResponse.errorDetail);
  }

  return parseAndValidateResponse(response, responseDataSchema, operation);
}

export async function tokenXFetchPost<S extends z.ZodType>({
  targetApi,
  operation,
  endpoint,
  requestBody,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
  targetApi: TokenXTargetApi;
  operation: RuntimeErrorOperation;
  endpoint: string;
  requestBody: unknown;
  responseDataSchema: S;
  redirectAfterLoginUrl: string;
}): Promise<z.infer<S>> {
  const oboToken = await getTokenXOrRedirect(
    redirectAfterLoginUrl,
    targetApi,
    operation,
  );

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: getBackendRequestHeaders(oboToken),
    });
  } catch {
    logRuntimeError(operation, RuntimeErrorCode.NETWORK_ERROR);
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
      logRuntimeError(
        operation,
        RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        response.status,
      );
    }
    throw createFrontendError(frontendErrorResponse.errorDetail);
  }

  return parseAndValidateResponse(response, responseDataSchema, operation);
}

export type TokenXFetchUpdateResult =
  | { success: true }
  | {
      success: false;
      errorDetail: ErrorDetail;
    };

export async function tokenXFetchUpdate({
  targetApi,
  operation,
  endpoint,
  requestBody,
  method = "POST",
}: {
  targetApi: TokenXTargetApi;
  operation: RuntimeErrorOperation;
  endpoint: string;
  requestBody: unknown;
  method?: "POST" | "PUT" | "DELETE";
}): Promise<TokenXFetchUpdateResult> {
  let oboToken: string;
  try {
    oboToken = await validateTokenAndGetTokenXWithoutLogging(targetApi);
  } catch (error) {
    if (isIdPortenTokenValidationError(error)) {
      logRuntimeError(operation, RuntimeErrorCode.TOKEN_VALIDATION_FAILED);
    } else if (isTokenXExchangeError(error)) {
      logRuntimeError(operation, RuntimeErrorCode.TOKEN_EXCHANGE_FAILED);
    } else {
      throw error;
    }
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

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
  } catch {
    logRuntimeError(operation, RuntimeErrorCode.NETWORK_ERROR);
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

  const frontendErrorResponse = await toFrontendErrorResponse(response);
  if (
    !isKnownDomainRejection(
      operation,
      response.status,
      frontendErrorResponse.type,
    )
  ) {
    logRuntimeError(
      operation,
      RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      response.status,
    );
  }

  return {
    success: false,
    errorDetail: frontendErrorResponse.errorDetail,
  };
}
