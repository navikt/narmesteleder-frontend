import { getServerEnv } from "@/env-variables/serverEnv";

export enum TokenXTargetApi {
  NARMESTELEDER_BACKEND = "NARMESTELEDER_BACKEND",
}

export const getBackendRequestHeaders = (oboToken: string) => ({
  Authorization: `Bearer ${oboToken}`,
  "Content-Type": "application/json",
});

export function getClientIdForTokenXTargetApi(
  targetApi: TokenXTargetApi,
): string {
  if (targetApi === TokenXTargetApi.NARMESTELEDER_BACKEND) {
    return getServerEnv().NARMESTELEDER_BACKEND_CLIENT_ID;
  } else {
    return "" as never;
  }
}
