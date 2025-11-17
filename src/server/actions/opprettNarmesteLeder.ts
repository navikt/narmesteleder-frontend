"use server";

import "server-only";
import { toLineManagerRequest } from "@/schemas/lineManagerRequestSchema";
import {
  NarmesteLederInfo,
  narmesteLederInfoSchema,
} from "@/schemas/nærmestelederFormSchema";
import { withActionResult } from "@/server/actions/ActionResult";
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
      requestBody: toLineManagerRequest(narmesteLeder),
    });
  });
