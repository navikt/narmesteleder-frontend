import "server-only";
import type { Organisasjon } from "@navikt/virksomhetsvelger";
import { unstable_rethrow } from "next/navigation";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";
import { getServerEnv } from "@/env-variables/serverEnv";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import {
  type AccessibleOrganizationResponse,
  accessibleOrganizationsResponseSchema,
} from "@/schemas/organisasjonSchema";
import { TokenXTargetApi } from "@/server/helpers";
import { RuntimeErrorOperation } from "@/server/observability/runtimeErrorContract";
import { tokenXFetchGet } from "@/server/tokenXFetch";

const getOrganisasjonerPath = () =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/access/organizations`;

export interface FetchOrganisasjonerResult {
  status: "available" | "empty" | "error";
  organisasjoner: Organisasjon[];
}

const toOrganisasjonerResult = (
  organisasjoner: Organisasjon[],
): FetchOrganisasjonerResult => ({
  status: organisasjoner.length > 0 ? "available" : "empty",
  organisasjoner,
});

const toOrganisasjon = ({
  orgNumber,
  name,
  subOrganizations,
}: AccessibleOrganizationResponse): Organisasjon => ({
  orgnr: orgNumber,
  navn: name,
  underenheter: subOrganizations.map(toOrganisasjon),
});

const realFetchOrganisasjoner =
  async (): Promise<FetchOrganisasjonerResult> => {
    try {
      const response = await tokenXFetchGet({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
        endpoint: getOrganisasjonerPath(),
        responseDataSchema: accessibleOrganizationsResponseSchema,
        redirectAfterLoginUrl: publicEnv.NEXT_PUBLIC_BASE_PATH,
      });

      return toOrganisasjonerResult(response.organizations.map(toOrganisasjon));
    } catch (error) {
      unstable_rethrow(error);
      return {
        status: "error",
        organisasjoner: [],
      };
    }
  };

const fakeFetchOrganisasjoner = async (): Promise<FetchOrganisasjonerResult> =>
  toOrganisasjonerResult(mockOrganisasjoner);

export const fetchOrganisasjoner = isLocalOrDemo
  ? fakeFetchOrganisasjoner
  : realFetchOrganisasjoner;
