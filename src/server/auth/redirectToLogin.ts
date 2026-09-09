import { redirect } from "next/navigation";
import { publicEnv } from "@/env-variables/publicEnv";

export function getRedirectAfterLoginUrlForAG(behovId: string) {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${behovId}`;
}

export function getRedirectAfterLoginUrlForLinemanagerReplacement(
  linemanagerId: string,
) {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/endre/${linemanagerId}`;
}

export const redirectToLogin = (redirectAfterLoginUrl: string) => {
  const loginPath = `/oauth2/login?redirect=${encodeURIComponent(redirectAfterLoginUrl)}`;

  return redirect(loginPath);
};
