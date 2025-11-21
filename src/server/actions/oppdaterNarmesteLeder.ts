"use server";

import { getServerEnv } from "@/env-variables/serverEnv";
import { toManagerRequest } from "@/schemas/lineManagerRequestSchema";
import {
  NarmesteLederForm,
  narmesteLederFormSchema,
} from "@/schemas/nærmestelederFormSchema";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { withActionResult } from "@/server/actions/ActionResult";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchUpdate } from "@/server/tokenXFetch";
import { mockable } from "@/utils/mockable";

const getLineManagerPutPath = (requirementId: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${requirementId}`;

const realOppdaterNarmesteLeder = async (
  requirementId: string,
  narmesteLeder: NarmesteLederForm,
) =>
  withActionResult(async () => {
    narmesteLederFormSchema.parse(narmesteLeder);
    requirementIdSchema.parse(requirementId);

    return await tokenXFetchUpdate({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint: getLineManagerPutPath(requirementId),
      method: "PUT",
      requestBody: toManagerRequest(narmesteLeder),
    });
  });

const fakeOppdaterNarmesteLeder = async () =>
  withActionResult(async () => {
    return;
  });

export const oppdaterNarmesteLeder = mockable({
  real: realOppdaterNarmesteLeder,
  mock: fakeOppdaterNarmesteLeder,
});
