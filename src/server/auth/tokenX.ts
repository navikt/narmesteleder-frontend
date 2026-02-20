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

const exchangeIdPortenTokenForTokenXOboToken = cache(
  async (idPortenToken: string, targetApi: TokenXTargetApi) => {
    const tokenXGrant = await requestOboToken(
      idPortenToken,
      getClientIdForTokenXTargetApi(targetApi),
    );

    if (!tokenXGrant.ok) {
      const errorMessage = `Failed to exchange idporten token: ${tokenXGrant.error}`;
      logErrorMessageAndThrowError(errorMessage);
    }

    return tokenXGrant.token;
  },
);

export const validateTokenAndGetTokenX = async (
  targetApi: TokenXTargetApi,
): Promise<string> => {
  const idPortenToken = await validateAndGetIdPortenToken();
  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
};

export const validateTokenAndGetTokenXOrRedirect = async (
  redirectAfterLoginUrl: string,
  targetApi: TokenXTargetApi,
) => {
  const idPortenToken = await validateAndGetIdPortenTokenOrRedirectToLogin(
    redirectAfterLoginUrl,
  );

  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
};
