import { publicEnv } from "@/env-variables/publicEnv";

const BASE = publicEnv.NEXT_PUBLIC_BASE_PATH;

/**
 * Returns a safe href-ready path for use in <a href>.
 * Normalizes both short ("/oversikt?...") and full ("/arbeidsgiver/.../oversikt?...")
 * forms to the same output, and rejects anything that isn't an internal path.
 */
export function getSafeReturnTo(returnTo?: string): string | null {
  if (!returnTo) return null;

  // Reject absolute and protocol-relative URLs
  if (returnTo.includes(":") || returnTo.startsWith("//")) return null;

  // Normalize: strip leading basePath if present to get a clean relative path
  const relativePath = returnTo.startsWith(BASE)
    ? returnTo.slice(BASE.length) || "/"
    : returnTo;

  // Must be an internal path
  if (!relativePath.startsWith("/")) return null;

  return `${BASE}${relativePath}`;
}
