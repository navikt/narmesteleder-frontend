import { redirect } from "next/navigation";
import { publicEnv } from "@/env-variables/publicEnv";
import { getSafeReturnTo } from "@/utils/returnTo";

export function getRedirectAfterLoginUrlForAG(behovId: string) {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${behovId}`;
}

export function getRedirectAfterLoginUrlForLinemanagerReplacement(
  linemanagerId: string,
  returnTo?: string,
) {
  const replacementPath = `${publicEnv.NEXT_PUBLIC_BASE_PATH}/endre/${linemanagerId}`;
  const safeReturnTo = getSafeReturnTo(returnTo);

  return safeReturnTo
    ? `${replacementPath}?${new URLSearchParams({ returnTo: safeReturnTo })}`
    : replacementPath;
}

export const redirectToLogin = (redirectAfterLoginUrl: string) => {
  const loginPath = `/oauth2/login?redirect=${encodeURIComponent(redirectAfterLoginUrl)}`;

  return redirect(loginPath);
};
