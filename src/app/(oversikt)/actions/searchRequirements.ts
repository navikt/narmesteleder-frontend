"use server";

import { fetchRequirementsList } from "@/server/fetchData/fetchRequirementsList";

export async function searchRequirementsAction(orgNumber: string) {
  return fetchRequirementsList(orgNumber);
}
