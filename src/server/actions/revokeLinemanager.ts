"use server";

import { getServerEnv } from "@/env-variables/serverEnv";
import {
  type LineManagerRevokeRequest,
  lineManagerRevokeRequestSchema,
} from "@/schemas/lineManagerRevokeSchema";
import { TokenXTargetApi } from "@/server/helpers";
import {
  logInvalidInput,
  RuntimeValidationTarget,
} from "@/server/observability/runtimeErrorLogger";
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
    logInvalidInput(
      "fjern_narmeste_leder",
      RuntimeValidationTarget.REVOKE_REQUEST,
      validatedPayload.error,
    );
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

  return tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    operation: "fjern_narmeste_leder",
    endpoint: getRevokeEndpoint(),
    requestBody: validatedPayload.data,
    method: "POST",
  });
}
