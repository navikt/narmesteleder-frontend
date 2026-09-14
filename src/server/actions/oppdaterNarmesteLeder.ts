"use server";

import { getServerEnv } from "@/env-variables/serverEnv";
import { toManagerRequest } from "@/schemas/lineManagerRequestSchema";
import {
  type NarmesteLederForm,
  narmesteLederFormSchema,
} from "@/schemas/nærmestelederFormSchema";
import { requirementIdSchema } from "@/schemas/requirementSchema";
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

const getLineManagerPutPath = (requirementId: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${requirementId}`;

export const oppdaterNarmesteLeder = async (
  requirementId: string,
  narmesteLeder: NarmesteLederForm,
): Promise<TokenXFetchUpdateResult> => {
  const validatedRequirementId = requirementIdSchema.safeParse(requirementId);
  const validatedForm = narmesteLederFormSchema.safeParse(narmesteLeder);

  if (!validatedRequirementId.success) {
    logInvalidInput(
      "oppdater_narmeste_leder",
      RuntimeValidationTarget.REQUIREMENT_ID,
      validatedRequirementId.error,
    );
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

  if (!validatedForm.success) {
    logInvalidInput(
      "oppdater_narmeste_leder",
      RuntimeValidationTarget.NARMESTE_LEDER_FORM,
      validatedForm.error,
    );
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }
  return await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    operation: "oppdater_narmeste_leder",
    endpoint: getLineManagerPutPath(validatedRequirementId.data),
    requestBody: toManagerRequest(validatedForm.data),
    method: "PUT",
  });
};
