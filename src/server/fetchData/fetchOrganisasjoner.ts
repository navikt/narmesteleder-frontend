import "server-only";
import { logger } from "@navikt/next-logger";
import type { Organisasjon } from "@navikt/virksomhetsvelger";
import { unstable_rethrow } from "next/navigation";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";
import { getServerEnv } from "@/env-variables/serverEnv";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import { organisasjonerSchema } from "@/schemas/organisasjonSchema";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchGet } from "@/server/tokenXFetch";

const getOrganisasjonerPath = () =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/tilganger`;

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

const realFetchOrganisasjoner =
  async (): Promise<FetchOrganisasjonerResult> => {
    try {
      const organisasjoner = await tokenXFetchGet({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        endpoint: getOrganisasjonerPath(),
        responseDataSchema: organisasjonerSchema,
        redirectAfterLoginUrl: publicEnv.NEXT_PUBLIC_BASE_PATH,
      });

      return toOrganisasjonerResult(organisasjoner);
    } catch (error) {
      unstable_rethrow(error);
      logger.warn(
        {
          endpoint: getOrganisasjonerPath(),
          errorMessage: error instanceof Error ? error.message : String(error),
        },
        "[Backend] failed to fetch organisasjoner for registrering flow",
      );
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
