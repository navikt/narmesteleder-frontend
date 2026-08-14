"use server";

import {
  type FetchLinemanagerSearchParams,
  type FetchLinemanagerSearchResult,
  fetchLinemanagerSearch,
} from "@/server/fetchData/fetchLinemanagerSearch";

export async function searchLinemanagersAction(
  params: FetchLinemanagerSearchParams,
): Promise<FetchLinemanagerSearchResult> {
  return fetchLinemanagerSearch(params);
}
