"use server";

import "server-only";
import { logger } from "@navikt/next-logger";
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
import { mockable } from "@/utils/mockable";
import { NARMESTE_LEDER_FALLBACK_ERROR_DETAIL } from "../backendErrorAdapter";

const getLineManagerPostPath = () =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager`;

const realOpprettNarmesteLeder = async (
  narmesteLeder: NarmesteLederInfo,
): Promise<TokenXFetchUpdateResult> => {
  logger.info(narmesteLeder);
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

const fakeOpprettNarmesteLeder = async (): Promise<TokenXFetchUpdateResult> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true };
};

export const opprettNarmesteLeder = mockable({
  real: realOpprettNarmesteLeder,
  mock: fakeOpprettNarmesteLeder,
});
