import { publicEnv } from "@/env-variables/publicEnv";

const BASE = publicEnv.NEXT_PUBLIC_BASE_PATH;

/**
 * Returns a safe relative path (without basePath prefix) for use with Next.js
 * Link or router.push(), which add basePath automatically.
 *
 * Accepts:
 * - Absolute paths with basePath prefix:  "/arbeidsgiver/ansatte/narmesteleder/oversikt?..."
 * - Relative paths within the app:        "/oversikt?..."
 *
 * Returns null for external URLs or paths outside basePath.
 */
export function getSafeReturnTo(returnTo?: string): string | null {
  if (!returnTo) return null;

  // Absolute path with basePath prefix — strip prefix and return relative
  if (returnTo.startsWith(`${BASE}/`) || returnTo === BASE) {
    return returnTo.slice(BASE.length) || "/";
  }

  // Already a relative path within the app (starts with /)
  if (returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    // Must look like an app-relative path — no absolute URLs disguised as relative
    try {
      // If it parses as a full URL, reject it
      new URL(returnTo);
      return null;
    } catch {
      return returnTo;
    }
  }

  return null;
}
