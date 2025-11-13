"use server";

import "server-only";
import {
  NarmesteLederInfo,
  narmesteLederInfoSchema,
} from "@/schemas/nærmestelederFormSchema";
import { withActionResult } from "@/server/actions/ActionResult";
import { mapToLineManagerRequest } from "@/server/actions/requestHelper";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchUpdate } from "@/server/tokenXFetch";
import { getLineManagerPostPath } from "../apiPaths";

export const opprettNarmesteLeder = async (narmesteLeder: NarmesteLederInfo) =>
  withActionResult(async () => {
    narmesteLederInfoSchema.parse(narmesteLeder);

    await tokenXFetchUpdate({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint: getLineManagerPostPath(),
      method: "POST",
      requestBody: mapToLineManagerRequest(narmesteLeder),
    });
  });
