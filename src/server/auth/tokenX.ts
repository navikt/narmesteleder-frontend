import { requestOboToken } from "@navikt/oasis";
import { cache } from "react";
import { redirectToLogin } from "@/server/auth/redirectToLogin";
import { validateIdPortenToken } from "@/server/auth/validateIdPortenToken";
import { logErrorMessageAndThrowError } from "@/utils/errorHandling";
import {
  getClientIdForTokenXTargetApi,
  type TokenXTargetApi,
} from "../helpers";

const validateAndGetIdPortenToken = async () => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    const errorMessage = `IdPorten token validation failed: ${validationResult.reason}`;
    logErrorMessageAndThrowError(errorMessage);
  }

  return validationResult.token;
};

const validateAndGetIdPortenTokenOrRedirectToLogin = async (
  redirectAfterLoginUrl: string,
) => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    return redirectToLogin(redirectAfterLoginUrl);
  }

  return validationResult.token;
};

export class TokenXExchangeError extends Error {
  constructor() {
    super("Kunne ikke hente TokenX-token");
    this.name = "TokenXExchangeError";
  }
}

export const isTokenXExchangeError = (
  error: unknown,
): error is TokenXExchangeError => error instanceof TokenXExchangeError;

const exchangeIdPortenTokenForTokenXOboToken = cache(
  async (idPortenToken: string, targetApi: TokenXTargetApi) => {
    let tokenXGrant: Awaited<ReturnType<typeof requestOboToken>>;
    try {
      tokenXGrant = await requestOboToken(
        idPortenToken,
        getClientIdForTokenXTargetApi(targetApi),
      );
    } catch {
      throw new TokenXExchangeError();
    }

    if (!tokenXGrant.ok) {
      throw new TokenXExchangeError();
    }

    return tokenXGrant.token;
  },
);

const logAndRethrowTokenXExchangeError = (error: unknown): never => {
  if (!isTokenXExchangeError(error)) {
    throw error;
  }
  logErrorMessageAndThrowError("Failed to exchange idporten token", error);
};

export const validateTokenAndGetTokenX = async (
  targetApi: TokenXTargetApi,
): Promise<string> => {
  const idPortenToken = await validateAndGetIdPortenToken();
  try {
    return await exchangeIdPortenTokenForTokenXOboToken(
      idPortenToken,
      targetApi,
    );
  } catch (error) {
    return logAndRethrowTokenXExchangeError(error);
  }
};

export const validateTokenAndGetTokenXOrRedirectWithoutLogging = async (
  redirectAfterLoginUrl: string,
  targetApi: TokenXTargetApi,
): Promise<string> => {
  const idPortenToken = await validateAndGetIdPortenTokenOrRedirectToLogin(
    redirectAfterLoginUrl,
  );

  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
};

export const validateTokenAndGetTokenXOrRedirect = async (
  redirectAfterLoginUrl: string,
  targetApi: TokenXTargetApi,
): Promise<string> => {
  try {
    return await validateTokenAndGetTokenXOrRedirectWithoutLogging(
      redirectAfterLoginUrl,
      targetApi,
    );
  } catch (error) {
    return logAndRethrowTokenXExchangeError(error);
  }
};
