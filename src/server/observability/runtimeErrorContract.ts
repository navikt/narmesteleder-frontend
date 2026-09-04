/**
 * Lukket katalog for runtime-feil som skal kunne grupperes stabilt i logger.
 * Domenespråket er norsk, mens det tekniske utfallet bruker suffikset `failed`.
 */
export const RuntimeErrorOperation = {
  HENT_ORGANISASJONER: "hent_organisasjoner",
  HENT_BEHOVSLISTE: "hent_behovsliste",
  HENT_BEHOV: "hent_behov",
} as const;

export type RuntimeErrorOperation =
  (typeof RuntimeErrorOperation)[keyof typeof RuntimeErrorOperation];

export const RuntimeErrorEvent = {
  ORGANISASJONER_FETCH_FAILED: "organisasjoner_fetch_failed",
  BEHOVSLISTE_FETCH_FAILED: "behovsliste_fetch_failed",
  BEHOV_FETCH_FAILED: "behov_fetch_failed",
} as const;

export type RuntimeErrorEvent =
  (typeof RuntimeErrorEvent)[keyof typeof RuntimeErrorEvent];

export const RuntimeErrorCode = {
  NETWORK_ERROR: "NETWORK_ERROR",
  UPSTREAM_HTTP_ERROR: "UPSTREAM_HTTP_ERROR",
  INVALID_JSON: "INVALID_JSON",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  TOKEN_EXCHANGE_FAILED: "TOKEN_EXCHANGE_FAILED",
} as const;

export type RuntimeErrorCode =
  (typeof RuntimeErrorCode)[keyof typeof RuntimeErrorCode];

const runtimeErrorEventByOperation = {
  [RuntimeErrorOperation.HENT_ORGANISASJONER]:
    RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
  [RuntimeErrorOperation.HENT_BEHOVSLISTE]:
    RuntimeErrorEvent.BEHOVSLISTE_FETCH_FAILED,
  [RuntimeErrorOperation.HENT_BEHOV]: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
} satisfies Record<RuntimeErrorOperation, RuntimeErrorEvent>;

const runtimeErrorMessageByOperation = {
  [RuntimeErrorOperation.HENT_ORGANISASJONER]:
    "Kunne ikke hente organisasjoner",
  [RuntimeErrorOperation.HENT_BEHOVSLISTE]:
    "Kunne ikke hente listen over behov for nærmeste leder",
  [RuntimeErrorOperation.HENT_BEHOV]:
    "Kunne ikke hente behovet for nærmeste leder",
} satisfies Record<RuntimeErrorOperation, string>;

export function getRuntimeErrorEvent(
  operation: RuntimeErrorOperation,
): RuntimeErrorEvent {
  return runtimeErrorEventByOperation[operation];
}

export function getRuntimeErrorMessage(
  operation: RuntimeErrorOperation,
): string {
  return runtimeErrorMessageByOperation[operation];
}

export function runtimeErrorContext(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  upstreamStatus?: number,
) {
  const context = {
    event_type: runtimeErrorEventByOperation[operation],
    operation,
    error_code: errorCode,
  } as const;

  return upstreamStatus === undefined
    ? context
    : { ...context, upstream_status: upstreamStatus };
}
