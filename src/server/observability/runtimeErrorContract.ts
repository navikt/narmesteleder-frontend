/**
 * Lukket katalog for runtime-feil som skal kunne grupperes stabilt i logger.
 * Domenespråket er norsk, mens det tekniske utfallet bruker suffikset `failed`.
 */
export const RuntimeErrorOperation = {
  HENT_ORGANISASJONER: "hent_organisasjoner",
  HENT_BEHOVSLISTE: "hent_behovsliste",
  HENT_BEHOV: "hent_behov",
  SOK_NARMESTE_LEDERE: "sok_narmeste_ledere",
  OPPRETT_NARMESTE_LEDER: "opprett_narmeste_leder",
  OPPDATER_NARMESTE_LEDER: "oppdater_narmeste_leder",
  FJERN_NARMESTE_LEDER: "fjern_narmeste_leder",
} as const;

export type RuntimeErrorOperation =
  (typeof RuntimeErrorOperation)[keyof typeof RuntimeErrorOperation];

export const RuntimeErrorEvent = {
  ORGANISASJONER_FETCH_FAILED: "organisasjoner_fetch_failed",
  BEHOVSLISTE_FETCH_FAILED: "behovsliste_fetch_failed",
  BEHOV_FETCH_FAILED: "behov_fetch_failed",
  NARMESTE_LEDERE_SEARCH_FAILED: "narmeste_ledere_search_failed",
  NARMESTE_LEDER_CREATE_FAILED: "narmeste_leder_create_failed",
  NARMESTE_LEDER_UPDATE_FAILED: "narmeste_leder_update_failed",
  NARMESTE_LEDER_REVOKE_FAILED: "narmeste_leder_revoke_failed",
} as const;

export type RuntimeErrorEvent =
  (typeof RuntimeErrorEvent)[keyof typeof RuntimeErrorEvent];

export const RuntimeErrorCode = {
  NETWORK_ERROR: "NETWORK_ERROR",
  UPSTREAM_HTTP_ERROR: "UPSTREAM_HTTP_ERROR",
  INVALID_JSON: "INVALID_JSON",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  TOKEN_EXCHANGE_FAILED: "TOKEN_EXCHANGE_FAILED",
  INVALID_INPUT: "INVALID_INPUT",
  TOKEN_VALIDATION_FAILED: "TOKEN_VALIDATION_FAILED",
} as const;

export type RuntimeErrorCode =
  (typeof RuntimeErrorCode)[keyof typeof RuntimeErrorCode];

const runtimeErrorEventByOperation = {
  [RuntimeErrorOperation.HENT_ORGANISASJONER]:
    RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
  [RuntimeErrorOperation.HENT_BEHOVSLISTE]:
    RuntimeErrorEvent.BEHOVSLISTE_FETCH_FAILED,
  [RuntimeErrorOperation.HENT_BEHOV]: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
  [RuntimeErrorOperation.SOK_NARMESTE_LEDERE]:
    RuntimeErrorEvent.NARMESTE_LEDERE_SEARCH_FAILED,
  [RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER]:
    RuntimeErrorEvent.NARMESTE_LEDER_CREATE_FAILED,
  [RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER]:
    RuntimeErrorEvent.NARMESTE_LEDER_UPDATE_FAILED,
  [RuntimeErrorOperation.FJERN_NARMESTE_LEDER]:
    RuntimeErrorEvent.NARMESTE_LEDER_REVOKE_FAILED,
} satisfies Record<RuntimeErrorOperation, RuntimeErrorEvent>;

const runtimeErrorMessageByOperation = {
  [RuntimeErrorOperation.HENT_ORGANISASJONER]:
    "Kunne ikke hente organisasjoner",
  [RuntimeErrorOperation.HENT_BEHOVSLISTE]:
    "Kunne ikke hente listen over behov for nærmeste leder",
  [RuntimeErrorOperation.HENT_BEHOV]:
    "Kunne ikke hente behovet for nærmeste leder",
  [RuntimeErrorOperation.SOK_NARMESTE_LEDERE]:
    "Kunne ikke søke etter nærmeste ledere",
  [RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER]:
    "Kunne ikke opprette nærmeste leder",
  [RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER]:
    "Kunne ikke oppdatere nærmeste leder",
  [RuntimeErrorOperation.FJERN_NARMESTE_LEDER]:
    "Kunne ikke fjerne nærmeste leder",
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

  const hasValidUpstreamStatus =
    upstreamStatus !== undefined &&
    Number.isInteger(upstreamStatus) &&
    upstreamStatus >= 100 &&
    upstreamStatus <= 599;

  return hasValidUpstreamStatus
    ? { ...context, upstream_status: upstreamStatus }
    : context;
}
