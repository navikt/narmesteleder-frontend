import "server-only";
import z from "zod";
import { logger } from "@navikt/next-logger";
import { logErrorMessageAndThrowError } from "@/utils/errorHandling";
import {
  validateTokenAndGetTokenX,
  validateTokenAndGetTokenXOrRedirect,
} from "@/utils/tokenX";
import { TokenXTargetApi, getBackendRequestHeaders } from "./helpers";
import {
  ErrorDetail,
  toFrontendError,
  toFrontendErrorResponse,
} from "./narmesteLederErrors";

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
  try {
    return responseDataSchema.parse(responseData);
  } catch (error) {
    logErrorMessageAndThrowError(
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
  const oboToken = await validateTokenAndGetTokenXOrRedirect(
    redirectAfterLoginUrl,
    targetApi,
  );

  const response = await fetch(endpoint, {
    headers: getBackendRequestHeaders(oboToken),
  });

  if (!response.ok) {
    const frontendError = await toFrontendError(response);
    logErrorMessageAndThrowError(
      `Fetch failed: method=GET endpoint=${endpoint} status=${response.status} ${response.statusText}`,
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

  logger.error(
    `Fetch failed: method=${method} endpoint=${endpoint} status=${response.status} ${response.statusText} backendErrorType=${frontendErrorResponse?.type}`,
  );

  return {
    success: false,
    errorDetail: frontendErrorResponse.errorDetail,
  };
}
