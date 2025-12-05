/**
 * Backend Error Adapter
 *
 * This module is responsible for:
 * - Parsing backend error responses
 * - Mapping backend error types to user-friendly messages
 * - Adapting backend errors to frontend error structures
 */
import { z } from "zod";
import { logger } from "@navikt/next-logger";

const NO_ACCESS_TO_FORM_MESSAGE =
  "Du har ikke tilgang til å åpne dette skjemaet";

export enum BackendErrorType {
  FORBIDDEN_MISSING_ORG_ACCESS,
  FORBIDDEN_MISSING_ALITINN_RESOURCE_ACCESS,
  BAD_REQUEST_LINEMANAGER_NAME_NIN_MISMATCH,
  BAD_REQUEST_EMPLOYEE_NAME_NIN_MISMATCH,
  BAD_REQUEST_NO_ACTIVE_SICK_LEAVE,
  BAD_REQUEST_EMPLOYEE_MISSING_EMPLOYMENT_IN_ORG,
  BAD_REQUEST_LINEMANAGER_MISSING_EMPLOYMENT_IN_ORG,
}

export const errorTypeToDetail: Record<BackendErrorType, ErrorDetail> = {
  [BackendErrorType.FORBIDDEN_MISSING_ORG_ACCESS]: {
    title: NO_ACCESS_TO_FORM_MESSAGE,
    message:
      "Du har ikke tilgang til denne organisasjonen. For å få tilgang må du ta kontakt med daglig leder eller HR.",
  },
  [BackendErrorType.FORBIDDEN_MISSING_ALITINN_RESOURCE_ACCESS]: {
    title: NO_ACCESS_TO_FORM_MESSAGE,
    message:
      'For å få tilgang må  du ta kontakt med daglig leder eller HR. Du trenger ressursen "Oppgi nærmeste leder for sykmeldt ansatt".',
  },
  [BackendErrorType.BAD_REQUEST_LINEMANAGER_NAME_NIN_MISMATCH]: {
    title: "Kombinasjonen av etternavn og fødselsnummer er feil",
    message:
      "Etternavnet du har fylt inn  for nærmeste leder stemmer ikke overens med oppgitt fødselsnummer. Sjekk at du har fylt inn riktig og prøv igjen.",
  },
  [BackendErrorType.BAD_REQUEST_EMPLOYEE_NAME_NIN_MISMATCH]: {
    title: "Kombinasjonen av etternavn og fødselsnummer er feil",
    message:
      "Etternavnet du har fylt inn  for den sykmeldte stemmer ikke overens med oppgitt fødselsnummer. Sjekk at du har fylt inn riktig og prøv igjen.",
  },
  [BackendErrorType.BAD_REQUEST_NO_ACTIVE_SICK_LEAVE]: {
    title: "Den ansatte er ikke sykmeldt",
    message:
      "For å kunne oppgi nærmeste leder for en ansatt må den ansatte være sykmeldt, og ha en aktiv sykmelding.",
  },
  [BackendErrorType.BAD_REQUEST_EMPLOYEE_MISSING_EMPLOYMENT_IN_ORG]: {
    title: "Den ansatte har ikke gyldig ansettelse i organisasjonen",
    message:
      "For å kunne oppgi nærmeste leder for en ansatt må den ansatte ha en gyldig ansettelse i organisasjonen.",
  },
  [BackendErrorType.BAD_REQUEST_LINEMANAGER_MISSING_EMPLOYMENT_IN_ORG]: {
    title: "Nærmeste leder har ikke gyldig ansettelse i organisasjonen",
    message:
      "For å kunne oppgi nærmeste leder for en ansatt må nærmeste leder ha en gyldig ansettelse i organisasjonen.",
  },
};

/**
 * Schema for backend error responses
 */
const backendErrorTypeSchema = z.enum(BackendErrorType);

const backendErrorSchema = z.object({
  type: backendErrorTypeSchema.optional(),
  message: z.string().optional(),
});

export type BackendErrorPayload = z.infer<typeof backendErrorSchema>;

/**
 * User-facing error detail with title and message
 */
export type ErrorDetail = {
  title: string;
  message: string;
};

/**
 * Frontend error response containing error type and details
 */
export type FrontendErrorResponse = {
  type?: BackendErrorType;
  errorDetail: ErrorDetail;
};

/**
 * Frontend error object with error details attached
 */
export type FrontendError = Error & { errorDetail: ErrorDetail };

/**
 * Fallback error detail for unknown or unparseable errors
 */
const NARMESTE_LEDER_FALLBACK_ERROR_MESSAGE =
  "Vi klarte ikke å gjennomføre handlingen. Prøv igjen senere.";

export const NARMESTE_LEDER_FALLBACK_ERROR_DETAIL: ErrorDetail = {
  title: "Beklager! Det har oppstått en uventet feil",
  message: NARMESTE_LEDER_FALLBACK_ERROR_MESSAGE,
};

/**
 * Creates a FrontendError with error details attached
 */
const createFrontendError = (errorDetail: ErrorDetail): FrontendError => {
  const error = new Error(errorDetail.message) as FrontendError;
  error.name = "FrontendError";
  error.errorDetail = errorDetail;
  return error;
};

/**
 * Type guard to check if an error is a FrontendError
 */
export const isFrontendError = (error: unknown): error is FrontendError =>
  error instanceof Error && error.name === "FrontendError";

/**
 * Maps backend error type to user-friendly error details
 */
const mapBackendErrorToDetail = (
  payload?: BackendErrorPayload,
): ErrorDetail => {
  if (!payload) {
    return NARMESTE_LEDER_FALLBACK_ERROR_DETAIL;
  }

  const { type } = payload;
  return type ? errorTypeToDetail[type] : NARMESTE_LEDER_FALLBACK_ERROR_DETAIL;
};

/**
 * Parses backend error response payload from HTTP response
 * Returns undefined if parsing fails or response is invalid
 */
const parseBackendErrorPayload = async (
  response: Response,
): Promise<BackendErrorPayload | undefined> => {
  let rawBody = "";
  try {
    const clonedResponse = response.clone();
    rawBody = await clonedResponse.text();
    const jsonPayload = JSON.parse(rawBody);
    const parsed = backendErrorSchema.safeParse(jsonPayload);

    if (parsed.success) {
      return parsed.data;
    }

    logger.warn(
      `Backend error response did not match expected schema - body=${rawBody.slice(0, 200)}`,
    );
  } catch (error) {
    logger.error(
      `Failed to parse backend error response as JSON: ${
        error instanceof Error ? error.message : String(error)
      } - body=${rawBody.slice(0, 200)}`,
    );
  }

  return undefined;
};

/**
 * Adapts backend error response to FrontendError
 * Always returns a FrontendError with error details for proper UI feedback
 */
export const adaptBackendErrorToFrontendError = async (
  response: Response,
): Promise<FrontendError> => {
  const backendErrorPayload = await parseBackendErrorPayload(response);
  const errorDetail = mapBackendErrorToDetail(backendErrorPayload);
  return createFrontendError(errorDetail);
};

/**
 * Adapts backend error response to FrontendErrorResponse
 * Returns error type (if available) and error details for UI display
 */
export const adaptBackendErrorToErrorResponse = async (
  response: Response,
): Promise<FrontendErrorResponse> => {
  const backendErrorPayload = await parseBackendErrorPayload(response);

  return {
    type: backendErrorPayload?.type,
    errorDetail: mapBackendErrorToDetail(backendErrorPayload),
  };
};

/**
 * @deprecated Use adaptBackendErrorToFrontendError instead
 */
export const toFrontendError = adaptBackendErrorToFrontendError;

/**
 * @deprecated Use adaptBackendErrorToErrorResponse instead
 */
export const toFrontendErrorResponse = adaptBackendErrorToErrorResponse;
