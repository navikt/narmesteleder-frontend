export function networkErrorCause(error: unknown) {
  let cause = error;

  for (let depth = 0; depth < 4; depth++) {
    if (typeof cause !== "object" || cause === null) {
      break;
    }

    const code = "code" in cause ? cause.code : undefined;
    switch (code) {
      case "ETIMEDOUT":
      case "UND_ERR_CONNECT_TIMEOUT":
      case "UND_ERR_HEADERS_TIMEOUT":
      case "UND_ERR_BODY_TIMEOUT":
        return "TIMEOUT";
      case "ENOTFOUND":
      case "EAI_AGAIN":
        return "DNS_LOOKUP_FAILED";
      case "ECONNREFUSED":
        return "CONNECTION_REFUSED";
      case "ECONNRESET":
      case "EPIPE":
      case "UND_ERR_SOCKET":
        return "CONNECTION_CLOSED";
      case "ABORT_ERR":
      case "UND_ERR_ABORTED":
        return "REQUEST_ABORTED";
    }

    const name = "name" in cause ? cause.name : undefined;
    if (name === "TimeoutError") {
      return "TIMEOUT";
    }
    if (name === "AbortError") {
      return "REQUEST_ABORTED";
    }

    cause = "cause" in cause ? cause.cause : undefined;
  }

  return "UNKNOWN";
}
