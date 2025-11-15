import "server-only";
import z from "zod";
import { logger } from "@navikt/next-logger";
import { requestOboToken } from "@navikt/oasis";
import { redirectToLogin } from "@/auth/redirectToLogin";
import { validateIdPortenToken } from "@/auth/validateIdPortenToken";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  validateTokenAndGetTokenX,
  validateTokenAndGetTokenXOrRedirect,
} from "../utils/tokenX";
import { TokenXTargetApi, getBackendRequestHeaders } from "./helpers";

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

const mockToken = "mock-token-value-for-local-and-demo";

const getOboTokenOrThrow = async (targetApi: TokenXTargetApi) => {
  if (isLocalOrDemo) {
    return mockToken;
  }
  const idPortenToken = await validateAndGetIdPortenToken();
  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
};

const getOboTokenOrRedirect = async (
  redirectAfterLoginUrl: string,
  targetApi: TokenXTargetApi,
) => {
  if (isLocalOrDemo) {
    return mockToken;
  }
  const idPortenToken = await validateAndGetIdPortenTokenOrRedirectToLogin(
    redirectAfterLoginUrl,
  );
  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
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
  const oboToken = await getOboTokenOrRedirect(
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
}) {
  const oboToken = await getOboTokenOrThrow(targetApi);

  const response = await fetch(endpoint, {
    method,
    body: JSON.stringify(requestBody),
    headers: getBackendRequestHeaders(oboToken),
  });

  if (!response.ok) {
    await logFailedFetchAndThrowError(response, endpoint, method);
  }

  return true;
}
