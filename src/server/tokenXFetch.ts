import "server-only";
import z from "zod";
import { logger } from "@navikt/next-logger";
import { logErrorMessageAndThrowError } from "@/utils/errorHandling";
import {
  validateTokenAndGetTokenX,
  validateTokenAndGetTokenXOrRedirect,
} from "@/utils/tokenX";
import { TokenXTargetApi, getBackendRequestHeaders } from "./helpers";
import { toFrontendError } from "./narmesteLederErrors";

async function logFailedFetchAndThrowError(
  response: Response,
  calledEndpoint: string,
  calledMethod: string = "GET",
): Promise<never> {
  let bodySnippet: string | undefined;
  try {
    const text = await response.text();
    bodySnippet = text.slice(0, 500);
  } catch {
    /* ignore */
  }

  const errorMessage = `Fetch failed: method=${calledMethod} endpoint=${calledEndpoint} status=${response.status} ${response.statusText}${bodySnippet ? ` body=${bodySnippet}` : ""}`;
  logErrorMessageAndThrowError(errorMessage);
}

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
    await logFailedFetchAndThrowError(response, endpoint);
  }

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch (err) {
    const errorMessage = `Failed to parse response as JSON from ${endpoint}: ${err}`;
    logErrorMessageAndThrowError(errorMessage);
  }

  try {
    return responseDataSchema.parse(responseData);
  } catch (err) {
    const errorMessage = `Failed to parse response data with zod schema from ${endpoint}: ${err}`;
    logErrorMessageAndThrowError(errorMessage);
  }
}

export type TokenXFetchUpdateResult =
  | { success: true }
  | {
      success: false;
      translatedErrorMessage: string;
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

  const frontendError = await toFrontendError(response);

  logger.error(
    `Fetch failed: method=${method} endpoint=${endpoint} status=${response.status} ${response.statusText} backendErrorType=${frontendError?.type}`,
  );

  return {
    success: false,
    translatedErrorMessage: frontendError.translatedMessage,
  };
}
