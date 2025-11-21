import { cache } from "react";
import { requestOboToken } from "@navikt/oasis";
import { redirectToLogin } from "@/auth/redirectToLogin";
import { validateIdPortenToken } from "@/auth/validateIdPortenToken";
import { logErrorMessageAndThrowError } from "@/utils/errorHandling";
import {
  TokenXTargetApi,
  getClientIdForTokenXTargetApi,
} from "../server/helpers";
import { mockable } from "./mockable";

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

const realValidateTokenAndGetTokenX = async (
  targetApi: TokenXTargetApi,
): Promise<string> => {
  const idPortenToken = await validateAndGetIdPortenToken();
  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
};

const realValidateTokenAndGetTokenXOrRedirect = async (
  redirectAfterLoginUrl: string,
  targetApi: TokenXTargetApi,
) => {
  const idPortenToken = await validateAndGetIdPortenTokenOrRedirectToLogin(
    redirectAfterLoginUrl,
  );

  return await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi);
};

const mockToken = "mock-token-for-local-or-demo";

export const validateTokenAndGetTokenX = mockable({
  real: realValidateTokenAndGetTokenX,
  mock: async () => mockToken,
});

export const validateTokenAndGetTokenXOrRedirect = mockable({
  real: realValidateTokenAndGetTokenXOrRedirect,
  mock: async () => mockToken,
});
