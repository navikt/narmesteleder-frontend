import "server-only";
import { unstable_rethrow } from "next/navigation";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";
import { getServerEnv } from "@/env-variables/serverEnv";
import { mockRequirementsList } from "@/mocks/data/mockRequirementsList";
import { simulateBackendDelay } from "@/mocks/simulateBackendDelay";
import {
  lineManagerRequirementsCollectionSchema,
  type RequirementsListItem,
} from "@/schemas/lineManagerRequirementsListSchema";
import { TokenXTargetApi } from "@/server/helpers";
import { RuntimeErrorOperation } from "@/server/observability/runtimeErrorContract";
import { tokenXFetchGet } from "@/server/tokenXFetch";

export interface FetchRequirementsListResult {
  status: "available" | "empty" | "error";
  requirements: RequirementsListItem[];
}

const getCreatedAfter = (): string => {
  const createdAfter = new Date();
  createdAfter.setFullYear(createdAfter.getFullYear() - 1);
  return createdAfter.toISOString();
};

const getRequirementsListPath = (orgNumber: string): string => {
  const params = new URLSearchParams({
    orgNumber,
    createdAfter: getCreatedAfter(),
  });
  return `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement?${params}`;
};

const toResult = (
  requirements: RequirementsListItem[],
): FetchRequirementsListResult => ({
  status: requirements.length > 0 ? "available" : "empty",
  requirements,
});

const realFetchRequirementsList = async (
  orgNumber: string,
): Promise<FetchRequirementsListResult> => {
  if (!orgNumber) {
    return { status: "empty", requirements: [] };
  }

  try {
    const response = await tokenXFetchGet({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      operation: RuntimeErrorOperation.HENT_BEHOVSLISTE,
      endpoint: getRequirementsListPath(orgNumber),
      responseDataSchema: lineManagerRequirementsCollectionSchema,
      redirectAfterLoginUrl: publicEnv.NEXT_PUBLIC_BASE_PATH,
    });

    return toResult(response.linemanagerRequirements);
  } catch (error) {
    unstable_rethrow(error);
    return { status: "error", requirements: [] };
  }
};

const fakeFetchRequirementsList = async (
  orgNumber: string,
): Promise<FetchRequirementsListResult> => {
  await simulateBackendDelay();

  if (!orgNumber) {
    return { status: "empty", requirements: [] };
  }

  const filtered = mockRequirementsList.filter(
    (r) => r.orgNumber === orgNumber,
  );

  return toResult(filtered);
};

export const fetchRequirementsList = isLocalOrDemo
  ? fakeFetchRequirementsList
  : realFetchRequirementsList;
