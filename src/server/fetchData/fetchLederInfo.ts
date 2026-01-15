import "server-only";
import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { mockLineManagerRequirement } from "@/mocks/data/mockLineManagerRequirement";
import {
  type LineManagerReadResponse,
  lineManagerReadSchema,
} from "@/schemas/lineManagerReadSchema";
import { TokenXTargetApi } from "@/server/helpers";
import {
  createFrontendError,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "@/server/narmesteLederErrorUtils";
import { tokenXFetchGet } from "@/server/tokenXFetch";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";

export type MockScenario = "fetch-error" | "slow-response";

const getLineManagerRequirementPath = (id: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${id}`;

const mapToLederInfo = (
  sykmeldtInfoResponse: LineManagerReadResponse,
): LederInfo => {
  return {
    id: sykmeldtInfoResponse.id,
    sykmeldtFnr: formatFnr(sykmeldtInfoResponse.employeeIdentificationNumber),
    orgnummer: sykmeldtInfoResponse.orgNumber,
    orgnavn: sykmeldtInfoResponse.orgName,
    hovedenhetOrgnummer: sykmeldtInfoResponse.mainOrgNumber,
    narmesteLederFnr: sykmeldtInfoResponse.managerIdentificationNumber,
    sykmeldt: {
      fornavn: sykmeldtInfoResponse.name.firstName,
      etternavn: sykmeldtInfoResponse.name.lastName,
      mellomnavn: sykmeldtInfoResponse.name.middleName,
      fullnavn: joinNonEmpty([
        sykmeldtInfoResponse.name.firstName,
        sykmeldtInfoResponse.name.middleName,
        sykmeldtInfoResponse.name.lastName,
      ]),
    },
  };
};

export type Navn = {
  fornavn: string;
  etternavn: string;
  mellomnavn: string | null;
  fullnavn: string;
};

export type LederInfo = {
  id: string;
  sykmeldtFnr: string;
  orgnummer: string;
  orgnavn: string | null;
  hovedenhetOrgnummer: string;
  narmesteLederFnr: string | null;
  sykmeldt: Navn;
};

const realFetchLederInfo = async (
  requirementId: string,
): Promise<LederInfo> => {
  const result = await tokenXFetchGet({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getLineManagerRequirementPath(requirementId),
    responseDataSchema: lineManagerReadSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(requirementId),
  });
  return mapToLederInfo(result);
};

/**
 * Mock fetch for local/demo environments.
 * Pass mockScenario to simulate different scenarios (e.g., "fetch-error", "slow-response").
 *
 * SAFETY: This mock is only used in local/demo environments.
 */
const fakeFetchLederInfo = async (
  _requirementId: string,
  mockScenario?: MockScenario,
): Promise<LederInfo> => {
  const delay = mockScenario === "slow-response" ? 2000 : 600;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (mockScenario === "fetch-error") {
    throw createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);
  }

  return mapToLederInfo(mockLineManagerRequirement);
};

export const fetchLederInfo = isLocalOrDemo
  ? fakeFetchLederInfo
  : realFetchLederInfo;
