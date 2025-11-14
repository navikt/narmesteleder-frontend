"use server";

import {
  NarmesteLederForm,
  narmesteLederFormSchema,
} from "@/schemas/nærmestelederFormSchema";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { withActionResult } from "@/server/actions/ActionResult";
import { mapToManagerRequest } from "@/server/actions/requestHelper";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchUpdate } from "@/server/tokenXFetch";
import { getLineManagerPutPath } from "../apiPaths";

export const oppdaterNarmesteLeder = async (
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
      requestBody: mapToManagerRequest(narmesteLeder),
    });
  });
