import { publicEnv } from "@/env-variables/publicEnv";

export function getSafeReturnTo(returnTo?: string): string | null {
  if (!returnTo) return null;

  if (returnTo.startsWith(`${publicEnv.NEXT_PUBLIC_BASE_PATH}/`)) {
    return returnTo;
  }

  return null;
}
