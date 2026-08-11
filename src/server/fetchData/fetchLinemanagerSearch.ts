import "server-only";
import { logger } from "@navikt/next-logger";
import { unstable_rethrow } from "next/navigation";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  mockLinemanagerSearchActive,
  mockLinemanagerSearchInactive,
} from "@/mocks/data/mockLinemanagerSearch";
import { simulateBackendDelay } from "@/mocks/simulateBackendDelay";
import {
  type LinemanagerSearchItem,
  type LinemanagerSearchPageInfo,
  linemanagerSearchResponseSchema,
} from "@/schemas/lineManagerSearchSchema";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchPost } from "@/server/tokenXFetch";

export interface FetchLinemanagerSearchParams {
  orgNumber: string;
  hasActiveSickLeave: boolean;
  text?: string | null;
  pageToken?: string | null;
  pageSize?: number;
}

export interface FetchLinemanagerSearchResult {
  status: "available" | "empty" | "error";
  linemanagers: LinemanagerSearchItem[];
  meta: LinemanagerSearchPageInfo | null;
}

const getSearchEndpoint = (): string =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/internal/api/v1/linemanager/search`;

const toResult = (
  linemanagers: LinemanagerSearchItem[],
  meta: LinemanagerSearchPageInfo,
): FetchLinemanagerSearchResult => ({
  status: linemanagers.length > 0 ? "available" : "empty",
  linemanagers,
  meta,
});

const realFetchLinemanagerSearch = async (
  params: FetchLinemanagerSearchParams,
): Promise<FetchLinemanagerSearchResult> => {
  if (!params.orgNumber) {
    return { status: "empty", linemanagers: [], meta: null };
  }

  const endpoint = getSearchEndpoint();

  try {
    const response = await tokenXFetchPost({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint,
      requestBody: {
        orgNumber: params.orgNumber,
        hasActiveSickLeave: params.hasActiveSickLeave,
        text: params.text ?? undefined,
        pageToken: params.pageToken ?? undefined,
        pageSize: params.pageSize ?? 2,
      },
      responseDataSchema: linemanagerSearchResponseSchema,
      redirectAfterLoginUrl: publicEnv.NEXT_PUBLIC_BASE_PATH,
    });

    return toResult(response.linemanagers, response.meta);
  } catch (error) {
    unstable_rethrow(error);
    logger.warn(
      {
        endpoint,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      "[Backend] failed to fetch linemanager search",
    );
    return { status: "error", linemanagers: [], meta: null };
  }
};

const fakeFetchLinemanagerSearch = async (
  params: FetchLinemanagerSearchParams,
): Promise<FetchLinemanagerSearchResult> => {
  await simulateBackendDelay();

  if (!params.orgNumber) {
    return { status: "empty", linemanagers: [], meta: null };
  }

  const mockData = params.hasActiveSickLeave
    ? mockLinemanagerSearchActive
    : mockLinemanagerSearchInactive;

  const filtered = params.text
    ? mockData.linemanagers.filter((item) => {
        const query = (params.text ?? "").trim().toLowerCase();
        if (/^\d{11}$/.test(query)) {
          return (
            item.employee.nationalIdentificationNumber === query ||
            item.manager.nationalIdentificationNumber === query
          );
        }
        const empName = [
          item.employee.name?.firstName,
          item.employee.name?.middleName,
          item.employee.name?.lastName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const mgrName = [
          item.manager.name?.firstName,
          item.manager.name?.middleName,
          item.manager.name?.lastName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return empName.includes(query) || mgrName.includes(query);
      })
    : mockData.linemanagers;

  return toResult(filtered, { ...mockData.meta, size: filtered.length });
};

export const fetchLinemanagerSearch = isLocalOrDemo
  ? fakeFetchLinemanagerSearch
  : realFetchLinemanagerSearch;
