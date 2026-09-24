import "server-only";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { getMockLinemanagerReplacement } from "@/mocks/data/mockLinemanagerReplacement";
import { simulateBackendDelay } from "@/mocks/simulateBackendDelay";
import {
  type LineManagerReplacementReadResponse,
  replacementSchema,
} from "@/schemas/lineManagerReadSchema";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { getRedirectAfterLoginUrlForLinemanagerReplacement } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/helpers";
import { RuntimeErrorOperation } from "@/server/observability/runtimeErrorContract";
import { tokenXFetchGet } from "@/server/tokenXFetch";
import type { ValgtVirksomhet } from "@/shared/state/virksomhetContext";
import {
  createFrontendError,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "../narmesteLederErrorUtils";

export type ReplacementMockScenario = "fetch-error";

export type LinemanagerReplacementContext = {
  initialData: NarmesteLederInfo;
  virksomhet: ValgtVirksomhet;
  isSykmeldtKnown: boolean;
};

const getLinemanagerPath = (id: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/internal/api/v1/linemanager/${id}`;

export const mapToReplacementContext = ({
  linemanagerRelation,
}: LineManagerReplacementReadResponse): LinemanagerReplacementContext => ({
  isSykmeldtKnown: linemanagerRelation.employee.name !== null,
  initialData: {
    sykmeldt: {
      fodselsnummer: linemanagerRelation.employee.name
        ? linemanagerRelation.employee.nationalIdentificationNumber
        : "",
      etternavn: linemanagerRelation.employee.name?.lastName ?? "",
      orgnummer: linemanagerRelation.organization.orgNumber,
    },
    leder: {
      fodselsnummer: "",
      etternavn: "",
      mobilnummer: "",
      epost: "",
    },
  },
  virksomhet: {
    orgnummer: linemanagerRelation.organization.orgNumber,
    orgnavn: linemanagerRelation.organization.name,
  },
});

const realFetchLinemanagerReplacement = async (
  linemanagerId: string,
  _mockScenario?: ReplacementMockScenario,
  returnTo?: string,
): Promise<LinemanagerReplacementContext | null> => {
  const response = await tokenXFetchGet({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    operation: RuntimeErrorOperation.HENT_NARMESTE_LEDER_FOR_ERSTATNING,
    endpoint: getLinemanagerPath(linemanagerId),
    responseDataSchema: replacementSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForLinemanagerReplacement(
      linemanagerId,
      returnTo,
    ),
    returnNullOnNotFound: true,
  });

  return response ? mapToReplacementContext(response) : null;
};

const fakeFetchLinemanagerReplacement = async (
  linemanagerId: string,
  mockScenario?: ReplacementMockScenario,
  _returnTo?: string,
): Promise<LinemanagerReplacementContext | null> => {
  await simulateBackendDelay();

  if (mockScenario === "fetch-error") {
    throw createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);
  }

  const response = getMockLinemanagerReplacement(linemanagerId);

  return response ? mapToReplacementContext(response) : null;
};

export const fetchLinemanagerReplacement = isLocalOrDemo
  ? fakeFetchLinemanagerReplacement
  : realFetchLinemanagerReplacement;
