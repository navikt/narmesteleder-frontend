import "server-only";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { mockLineManagerRequirement } from "@/mocks/data/mockLineManagerRequirement";
import { simulateBackendDelay } from "@/mocks/simulateBackendDelay";
import {
  type LineManagerReplacementReadResponse,
  lineManagerReplacementReadSchema,
} from "@/schemas/lineManagerReadSchema";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { getRedirectAfterLoginUrlForLinemanagerReplacement } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/helpers";
import { RuntimeErrorOperation } from "@/server/observability/runtimeErrorContract";
import { tokenXFetchGet } from "@/server/tokenXFetch";
import {
  createFrontendError,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "../narmesteLederErrorUtils";

export type ReplacementMockScenario = "fetch-error";

const getLinemanagerPath = (id: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/${id}`;

export const mapToReplacementDefaults = (
  response: LineManagerReplacementReadResponse,
): NarmesteLederInfo => ({
  sykmeldt: {
    fodselsnummer: response.employeeIdentificationNumber,
    etternavn: response.name.lastName,
    orgnummer: response.orgNumber,
  },
  leder: {
    fodselsnummer: "",
    etternavn: "",
    mobilnummer: "",
    epost: "",
  },
});

const realFetchLinemanagerReplacement = async (
  linemanagerId: string,
): Promise<NarmesteLederInfo | null> => {
  const response = await tokenXFetchGet({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    operation: RuntimeErrorOperation.HENT_NARMESTE_LEDER_FOR_ERSTATNING,
    endpoint: getLinemanagerPath(linemanagerId),
    responseDataSchema: lineManagerReplacementReadSchema,
    redirectAfterLoginUrl:
      getRedirectAfterLoginUrlForLinemanagerReplacement(linemanagerId),
    returnNullOnNotFound: true,
  });

  return response ? mapToReplacementDefaults(response) : null;
};

const fakeFetchLinemanagerReplacement = async (
  _linemanagerId: string,
  mockScenario?: ReplacementMockScenario,
): Promise<NarmesteLederInfo> => {
  await simulateBackendDelay();

  if (mockScenario === "fetch-error") {
    throw createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);
  }

  return mapToReplacementDefaults(mockLineManagerRequirement);
};

export const fetchLinemanagerReplacement = isLocalOrDemo
  ? fakeFetchLinemanagerReplacement
  : realFetchLinemanagerReplacement;
