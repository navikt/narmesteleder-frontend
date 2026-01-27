"use server";

import type { LumiSurveyTransportPayload } from "@navikt/lumi-survey";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { simulateBackendDelay } from "@/mocks/simulateBackendDelay";
import { lumiSurveyPayloadSchema } from "@/schemas/lumiSurveyPayloadSchema";
import { TokenXTargetApi } from "../helpers";
import {
  type TokenXFetchUpdateResult,
  tokenXFetchUpdate,
} from "../tokenXFetch";

const getLumiSurveyFeedbackEndpoint = () =>
  `${getServerEnv().LUMI_API_HOST}/api/tokenx/v1/feedback`;

async function realOpprettSurveyFeedback(
  payload: LumiSurveyTransportPayload,
): Promise<TokenXFetchUpdateResult> {
  const validatedPayload = lumiSurveyPayloadSchema.parse(payload);

  return await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.LUMI_API,
    endpoint: getLumiSurveyFeedbackEndpoint(),
    requestBody: validatedPayload,
  });
}

export const opprettSurveyFeedback = isLocalOrDemo
  ? async () => {
      await simulateBackendDelay();
    }
  : realOpprettSurveyFeedback;
