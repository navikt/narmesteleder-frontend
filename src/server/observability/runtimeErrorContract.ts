import { defineEvent } from "@navikt/esyfo-logger";
import type { NetworkErrorCode } from "./networkErrorCode";

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

export const RuntimeValidationTarget = {
  NARMESTE_LEDER_INFO: "narmeste_leder_info",
  REQUIREMENT_ID: "requirement_id",
  NARMESTE_LEDER_FORM: "narmeste_leder_form",
  REVOKE_REQUEST: "revoke_request",
  UPSTREAM_RESPONSE: "upstream_response",
} as const;

export type RuntimeValidationTarget =
  (typeof RuntimeValidationTarget)[keyof typeof RuntimeValidationTarget];

type RuntimeErrorContext = {
  error_code: RuntimeErrorCode;
  upstream_status?: number;
};

type RuntimeValidationContext = RuntimeErrorContext & {
  validation_target: RuntimeValidationTarget;
  validationIssues: string;
};

type RuntimeFailureContext = RuntimeErrorContext & {
  network_code?: NetworkErrorCode;
  validation_target?: RuntimeValidationTarget;
  validationIssues?: string;
};

function defineRuntimeFailure(
  operation: string,
  name: string,
  message: string,
) {
  return defineEvent<RuntimeFailureContext>({
    operation,
    name,
    message,
    level: "error",
  });
}

export const runtimeErrorDefinitions = {
  hent_organisasjoner: defineRuntimeFailure(
    "hent_organisasjoner",
    "organisasjoner_fetch_failed",
    "Kunne ikke hente organisasjoner",
  ),
  hent_behovsliste: defineRuntimeFailure(
    "hent_behovsliste",
    "behovsliste_fetch_failed",
    "Kunne ikke hente listen over behov for nærmeste leder",
  ),
  hent_behov: defineRuntimeFailure(
    "hent_behov",
    "behov_fetch_failed",
    "Kunne ikke hente behovet for nærmeste leder",
  ),
  hent_narmeste_leder_for_erstatning: defineRuntimeFailure(
    "hent_narmeste_leder_for_erstatning",
    "linemanager_replacement_fetch_failed",
    "Kunne ikke hente nærmeste leder for erstatning",
  ),
  sok_narmeste_ledere: defineRuntimeFailure(
    "sok_narmeste_ledere",
    "narmeste_ledere_search_failed",
    "Kunne ikke søke etter nærmeste ledere",
  ),
  opprett_narmeste_leder: defineRuntimeFailure(
    "opprett_narmeste_leder",
    "narmeste_leder_create_failed",
    "Kunne ikke opprette nærmeste leder",
  ),
  oppdater_narmeste_leder: defineRuntimeFailure(
    "oppdater_narmeste_leder",
    "narmeste_leder_update_failed",
    "Kunne ikke oppdatere nærmeste leder",
  ),
  fjern_narmeste_leder: defineRuntimeFailure(
    "fjern_narmeste_leder",
    "narmeste_leder_revoke_failed",
    "Kunne ikke fjerne nærmeste leder",
  ),
};

export const RuntimeErrorOperation = {
  HENT_ORGANISASJONER: "hent_organisasjoner",
  HENT_BEHOVSLISTE: "hent_behovsliste",
  HENT_BEHOV: "hent_behov",
  HENT_NARMESTE_LEDER_FOR_ERSTATNING: "hent_narmeste_leder_for_erstatning",
  SOK_NARMESTE_LEDERE: "sok_narmeste_ledere",
  OPPRETT_NARMESTE_LEDER: "opprett_narmeste_leder",
  OPPDATER_NARMESTE_LEDER: "oppdater_narmeste_leder",
  FJERN_NARMESTE_LEDER: "fjern_narmeste_leder",
} as const satisfies Record<string, keyof typeof runtimeErrorDefinitions>;

export type RuntimeErrorOperation =
  (typeof RuntimeErrorOperation)[keyof typeof RuntimeErrorOperation];

export const runtimeInputWarnings = {
  opprett_narmeste_leder: defineEvent<RuntimeValidationContext>({
    ...runtimeErrorDefinitions.opprett_narmeste_leder,
    level: "warn",
  }),
  oppdater_narmeste_leder: defineEvent<RuntimeValidationContext>({
    ...runtimeErrorDefinitions.oppdater_narmeste_leder,
    level: "warn",
  }),
  fjern_narmeste_leder: defineEvent<RuntimeValidationContext>({
    ...runtimeErrorDefinitions.fjern_narmeste_leder,
    level: "warn",
  }),
};

export type RuntimeInputOperation = keyof typeof runtimeInputWarnings;

export function runtimeErrorContext(
  errorCode: RuntimeErrorCode,
  upstreamStatus?: number,
): RuntimeErrorContext {
  const context = { error_code: errorCode };
  const hasValidUpstreamStatus =
    upstreamStatus !== undefined &&
    Number.isInteger(upstreamStatus) &&
    upstreamStatus >= 100 &&
    upstreamStatus <= 599;

  return hasValidUpstreamStatus
    ? { ...context, upstream_status: upstreamStatus }
    : context;
}
