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
import { withBackendMode } from "@/utils/withBackendMode";

const getLineManagerPostPath = () =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager`;

const realOpprettNarmesteLeder = async (narmesteLeder: NarmesteLederInfo) =>
  withActionResult(async () => {
    narmesteLederInfoSchema.parse(narmesteLeder);

    await tokenXFetchUpdate({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint: getLineManagerPostPath(),
      method: "POST",
      requestBody: toLineManagerRequest(narmesteLeder),
    });
  });

const fakeOpprettNarmesteLeder = async () =>
  withActionResult(async () => {
    return;
  });

export const opprettNarmesteLeder = withBackendMode({
  real: realOpprettNarmesteLeder,
  fake: fakeOpprettNarmesteLeder,
});
