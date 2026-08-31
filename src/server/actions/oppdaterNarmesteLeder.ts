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
  RuntimeErrorCode,
  RuntimeErrorOperation,
} from "@/server/observability/runtimeErrorContract";
import { logRuntimeError } from "@/server/observability/runtimeErrorLogger";
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
    logRuntimeError(
      RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
      RuntimeErrorCode.INVALID_INPUT,
    );
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }

  if (!validatedForm.success) {
    logRuntimeError(
      RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
      RuntimeErrorCode.INVALID_INPUT,
    );
    return {
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    };
  }
  return await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
    endpoint: getLineManagerPutPath(validatedRequirementId.data),
    requestBody: toManagerRequest(validatedForm.data),
    method: "PUT",
  });
};
