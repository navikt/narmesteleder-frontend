import { getToken, validateIdportenToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { cache } from "react";

export type TokenValidationResult =
  | { success: true; token: string }
  | { success: false; reason: TokenValidationFailureReason };

export const TokenValidationFailureReason = {
  MISSING_TOKEN: "MISSING_TOKEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

export type TokenValidationFailureReason =
  (typeof TokenValidationFailureReason)[keyof typeof TokenValidationFailureReason];

export const validateIdPortenToken = cache(
  async (): Promise<TokenValidationResult> => {
    let idportenToken: string | null | undefined;
    try {
      const headersList = await headers();
      idportenToken = getToken(headersList);
    } catch {
      return {
        success: false,
        reason: TokenValidationFailureReason.VALIDATION_ERROR,
      };
    }

    if (!idportenToken) {
      return {
        success: false,
        reason: TokenValidationFailureReason.MISSING_TOKEN,
      };
    }

    let validationResult: Awaited<ReturnType<typeof validateIdportenToken>>;
    try {
      validationResult = await validateIdportenToken(idportenToken);
    } catch {
      return {
        success: false,
        reason: TokenValidationFailureReason.VALIDATION_ERROR,
      };
    }
    if (!validationResult.ok) {
      return {
        success: false,
        reason: TokenValidationFailureReason.INVALID_TOKEN,
      };
    }

    return { success: true, token: idportenToken };
  },
);
