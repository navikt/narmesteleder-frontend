import { logger } from "@navikt/next-logger";
import { getToken, validateIdportenToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { cache } from "react";

export type TokenValidationResult =
  | { success: true; token: string }
  | { success: false; reason: string };

export const validateIdPortenToken = cache(
  async (): Promise<TokenValidationResult> => {
    const headersList = await headers();
    const idportenToken = getToken(headersList);

    if (!idportenToken) {
      const error = "Missing idporten token";
      logger.warn(error);
      return { success: false, reason: error };
    }

    const validationResult = await validateIdportenToken(idportenToken);
    if (!validationResult.ok) {
      const error = `Invalid JWT token found, cause: ${validationResult.errorType} ${validationResult.error}`;
      logger.warn(error);
      return { success: false, reason: error };
    }

    return { success: true, token: idportenToken };
  },
);
