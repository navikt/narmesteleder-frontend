import { getServerEnv } from "@/env-variables/serverEnv";

export const getLineManagerRequirementPath = (id: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${id}`;
