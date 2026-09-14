const nativeCodes = [
  "ETIMEDOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ECONNRESET",
  "EPIPE",
  "UND_ERR_SOCKET",
  "ABORT_ERR",
  "UND_ERR_ABORTED",
  "CERT_HAS_EXPIRED",
  "CERT_NOT_YET_VALID",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "ERR_TLS_HANDSHAKE_TIMEOUT",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
] as const;

export type NetworkErrorCode =
  | (typeof nativeCodes)[number]
  | "AbortError"
  | "TimeoutError";

const allowedCodes: ReadonlySet<string> = new Set(nativeCodes);

export function networkErrorCode(error: unknown): NetworkErrorCode | undefined {
  let cause = error;

  try {
    // Begrenset oppslag stopper også sirkulære cause-kjeder.
    for (let depth = 0; depth < 4; depth++) {
      if (typeof cause !== "object" || cause === null) {
        break;
      }

      const code = "code" in cause ? cause.code : undefined;
      if (typeof code === "string" && allowedCodes.has(code)) {
        return code as NetworkErrorCode;
      }

      const name = "name" in cause ? cause.name : undefined;
      if (name === "AbortError" || name === "TimeoutError") {
        return name;
      }

      cause = "cause" in cause ? cause.cause : undefined;
    }
  } catch {
    // Et uvanlig feilobjekt skal ikke få diagnostikken til å kaste.
  }

  return undefined;
}
