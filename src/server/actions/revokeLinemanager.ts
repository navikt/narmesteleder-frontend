"use server";

import { logger } from "@navikt/next-logger";
import { z } from "zod";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  type LineManagerRevokeRequest,
  lineManagerRevokeRequestSchema,
} from "@/schemas/lineManagerRevokeSchema";
import { TokenXTargetApi } from "@/server/helpers";
import {
  type TokenXFetchUpdateResult,
  tokenXFetchUpdate,
} from "@/server/tokenXFetch";
import { NARMESTE_LEDER_FALLBACK_ERROR_DETAIL } from "../narmesteLederErrorUtils";

const getRevokeEndpoint = () =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/revoke`;

export async function revokeLinemanager(
  payload: LineManagerRevokeRequest,
): Promise<TokenXFetchUpdateResult> {
  const validatedPayload = lineManagerRevokeRequestSchema.safeParse(payload);
  if (!validatedPayload.success) {
    logger.error(
      { validationIssues: z.prettifyError(validatedPayload.error) },
      "[ServerAction][Validation] invalid payload in revokeLinemanager",
    );
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

  return tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getRevokeEndpoint(),
    requestBody: validatedPayload.data,
    method: "POST",
  });
}
