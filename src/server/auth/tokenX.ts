import { requestOboToken } from "@navikt/oasis";
import { cache } from "react";
import { redirectToLogin } from "@/server/auth/redirectToLogin";
import { validateIdPortenToken } from "@/server/auth/validateIdPortenToken";
import {
  getClientIdForTokenXTargetApi,
  type TokenXTargetApi,
} from "../helpers";

export class IdPortenTokenValidationError extends Error {
  constructor() {
    super("Kunne ikke validere ID-porten-token");
    this.name = "IdPortenTokenValidationError";
  }
}

export const isIdPortenTokenValidationError = (
  error: unknown,
): error is IdPortenTokenValidationError =>
  error instanceof IdPortenTokenValidationError;

const validateAndGetIdPortenTokenWithoutLogging = async (): Promise<string> => {
  const validationResult = await validateIdPortenToken();

  if (!validationResult.success) {
    throw new IdPortenTokenValidationError();
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

export const validateTokenAndGetTokenXWithoutLogging = async (
  targetApi: TokenXTargetApi,
): Promise<string> => {
  const idPortenToken = await validateAndGetIdPortenTokenWithoutLogging();
  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
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
