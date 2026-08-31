"use server";

import { getServerEnv } from "@/env-variables/serverEnv";
import {
  type LineManagerRevokeRequest,
  lineManagerRevokeRequestSchema,
} from "@/schemas/lineManagerRevokeSchema";
import { TokenXTargetApi } from "@/server/helpers";
import {
  RuntimeErrorCode,
  RuntimeErrorOperation,
} from "@/server/observability/runtimeErrorContract";
import { logRuntimeError } from "@/server/observability/runtimeErrorLogger";
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
    logRuntimeError(
      RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
      RuntimeErrorCode.INVALID_INPUT,
    );
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

  return tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
    endpoint: getRevokeEndpoint(),
    requestBody: validatedPayload.data,
    method: "POST",
  });
}
