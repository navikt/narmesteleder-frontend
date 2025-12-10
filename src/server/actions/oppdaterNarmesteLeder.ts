"use server";

import { getServerEnv } from "@/env-variables/serverEnv";
import { toManagerRequest } from "@/schemas/lineManagerRequestSchema";
import {
  NarmesteLederForm,
  narmesteLederFormSchema,
} from "@/schemas/nærmestelederFormSchema";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { TokenXTargetApi } from "@/server/helpers";
import {
  TokenXFetchUpdateResult,
  tokenXFetchUpdate,
} from "@/server/tokenXFetch";
import { mockable } from "@/utils/mockable";
import { NARMESTE_LEDER_FALLBACK_ERROR_DETAIL } from "../narmesteLederErrorUtils";

const getLineManagerPutPath = (requirementId: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${requirementId}`;

const realOppdaterNarmesteLeder = async (
  requirementId: string,
  narmesteLeder: NarmesteLederForm,
): Promise<TokenXFetchUpdateResult> => {
  const validatedRequirementId = requirementIdSchema.safeParse(requirementId);
  const validatedForm = narmesteLederFormSchema.safeParse(narmesteLeder);

  if (!validatedRequirementId.success || !validatedForm.success) {
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }
  return await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getLineManagerPutPath(validatedRequirementId.data),
    requestBody: toManagerRequest(validatedForm.data),
    method: "PUT",
  });
};

const fakeOppdaterNarmesteLeder =
  async (): Promise<TokenXFetchUpdateResult> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true };
  };

export const oppdaterNarmesteLeder = mockable({
  real: realOppdaterNarmesteLeder,
  mock: fakeOppdaterNarmesteLeder,
});
