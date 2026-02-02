import "server-only";
import type z from "zod";
import {
  logApiSuccess,
  logBackendError,
  logNetworkError,
  logParseError,
  logSchemaValidationError,
} from "@/utils/logHandling";
import {
  validateTokenAndGetTokenX,
  validateTokenAndGetTokenXOrRedirect,
} from "@/utils/tokenX";
import { getBackendRequestHeaders, type TokenXTargetApi } from "./helpers";
import {
  type ErrorDetail,
  toFrontendError,
  toFrontendErrorResponse,
} from "./narmesteLederErrorUtils";

const readJsonBody = async (
  response: Response,
  endpoint: string,
): Promise<unknown> => {
  try {
    return await response.json();
  } catch (error) {
    logParseError(error);
    throw new Error(
      `Failed to parse response as JSON from ${endpoint}: ${error}`,
    );
  }
};

const validateResponse = <S extends z.ZodTypeAny>(
  responseData: unknown,
  endpoint: string,
  responseDataSchema: S,
): z.infer<S> => {
  try {
    return responseDataSchema.parse(responseData);
  } catch (error: unknown) {
    logSchemaValidationError(error);
    throw new Error(
      `Failed to parse response data with zod schema from ${endpoint}: ${error}`,
    );
  }
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
  endpoint,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
  targetApi: TokenXTargetApi;
  endpoint: string;
  responseDataSchema: S;
  redirectAfterLoginUrl: string;
}): Promise<z.infer<S>> {
  const startTime = Date.now();
  const oboToken = await validateTokenAndGetTokenXOrRedirect(
    redirectAfterLoginUrl,
    targetApi,
  );

  const response = await fetch(endpoint, {
    headers: getBackendRequestHeaders(oboToken),
  });

  const durationMs = Date.now() - startTime;

  if (!response.ok) {
    const frontendError = await toFrontendError(response);
    logBackendError({
      method: "GET",
      endpoint,
      status: response.status,
      durationMs,
      error: frontendError,
    });
    throw frontendError;
  }

  logApiSuccess({
    method: "GET",
    endpoint,
    status: response.status,
    durationMs,
  });

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
  const startTime = Date.now();
  const oboToken = await validateTokenAndGetTokenX(targetApi);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      body: JSON.stringify(requestBody),
      headers: getBackendRequestHeaders(oboToken),
    });
    const durationMs = Date.now() - startTime;

    if (response.ok) {
      logApiSuccess({
        method,
        endpoint,
        status: response.status,
        durationMs,
      });
      return { success: true };
    }
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logNetworkError({
      method,
      endpoint,
      durationMs,
      error,
      status: 0,
    });
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const durationMs = Date.now() - startTime;
  const frontendErrorResponse = await toFrontendErrorResponse(response);

  logBackendError({
    method,
    endpoint,
    status: response.status,
    durationMs,
    error: frontendErrorResponse,
  });

  return {
    success: false,
    errorDetail: frontendErrorResponse.errorDetail,
  };
}
