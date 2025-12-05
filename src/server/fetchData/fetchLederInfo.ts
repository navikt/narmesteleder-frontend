import "server-only";
import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { getServerEnv } from "@/env-variables/serverEnv";
import { mockLineManagerRequirement } from "@/mocks/data/mockLineManagerRequirement";
import {
  LineManagerReadResponse,
  lineManagerReadSchema,
} from "@/schemas/lineManagerReadSchema";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchGet } from "@/server/tokenXFetch";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { mockable } from "@/utils/mockable";

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

const fakeFetchLederInfo = async (): Promise<LederInfo> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mapToLederInfo(mockLineManagerRequirement);
};

export const fetchLederInfo = mockable({
  real: realFetchLederInfo,
  mock: fakeFetchLederInfo,
});
