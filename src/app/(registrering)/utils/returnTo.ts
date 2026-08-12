import { publicEnv } from "@/env-variables/publicEnv";

export function getSafeReturnTo(returnTo?: string): string | null {
  if (!returnTo) return null;

  // Relative path starting with basePath (e.g. "/oversikt?...")
  if (returnTo.startsWith("/")) {
    return returnTo;
  }

  // Absolute URL starting with basePath (legacy)
  if (returnTo.startsWith(`${publicEnv.NEXT_PUBLIC_BASE_PATH}/`)) {
    // Return just the path portion so Next.js Link/router handles basePath automatically
    return returnTo.slice(publicEnv.NEXT_PUBLIC_BASE_PATH.length);
  }

  return null;
}
