"use server";

import "server-only";
import { getServerEnv } from "@/env-variables/serverEnv";
import { toLineManagerRequest } from "@/schemas/lineManagerRequestSchema";
import {
  NarmesteLederInfo,
  narmesteLederInfoSchema,
} from "@/schemas/nærmestelederFormSchema";
import { TokenXTargetApi } from "@/server/helpers";
import {
  TokenXFetchUpdateResult,
  tokenXFetchUpdate,
} from "@/server/tokenXFetch";
import { NARMESTE_LEDER_FALLBACK_ERROR_DETAIL } from "../narmesteLederErrorUtils";

const getLineManagerPostPath = () =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager`;

export const opprettNarmesteLeder = async (
  narmesteLeder: NarmesteLederInfo,
): Promise<TokenXFetchUpdateResult> => {
  const validationResult = narmesteLederInfoSchema.safeParse(narmesteLeder);
  if (!validationResult.success) {
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

  return tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getLineManagerPostPath(),
    requestBody: toLineManagerRequest(validationResult.data),
    method: "POST",
  });
};
