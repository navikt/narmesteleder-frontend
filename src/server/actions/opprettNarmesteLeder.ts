"use server";

import "server-only";
import { getServerEnv } from "@/env-variables/serverEnv";
import { toLineManagerRequest } from "@/schemas/lineManagerRequestSchema";
import {
  NarmesteLederInfo,
  narmesteLederInfoSchema,
} from "@/schemas/nærmestelederFormSchema";
import { withActionResult } from "@/server/actions/ActionResult";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchUpdate } from "@/server/tokenXFetch";

const getLineManagerPostPath = () =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager`;

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
