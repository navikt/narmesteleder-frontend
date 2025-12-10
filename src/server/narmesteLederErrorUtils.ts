import { z } from "zod";
import { logger } from "@navikt/next-logger";

const NO_ACCESS_TO_FORM_MESSAGE =
  "Du har ikke tilgang til å åpne dette skjemaet";

export enum BackendErrorType {
  MISSING_ORG_ACCESS = "MISSING_ORG_ACCESS",
  MISSING_ALITINN_RESOURCE_ACCESS = "MISSING_ALITINN_RESOURCE_ACCESS",
  LINEMANAGER_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH = "LINEMANAGER_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH",
  EMPLOYEE_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH = "EMPLOYEE_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH",
  NO_ACTIVE_SICK_LEAVE = "NO_ACTIVE_SICK_LEAVE",
  EMPLOYEE_MISSING_EMPLOYMENT_IN_ORG = "EMPLOYEE_MISSING_EMPLOYMENT_IN_ORG",
  LINEMANAGER_MISSING_EMPLOYMENT_IN_ORG = "LINEMANAGER_MISSING_EMPLOYMENT_IN_ORG",
}

export const errorTypeToDetail: Record<BackendErrorType, ErrorDetail> = {
  [BackendErrorType.MISSING_ORG_ACCESS]: {
    title: NO_ACCESS_TO_FORM_MESSAGE,
    message:
      "Du har ikke tilgang til denne organisasjonen. For å få tilgang må du ta kontakt med daglig leder eller HR.",
  },
  [BackendErrorType.MISSING_ALITINN_RESOURCE_ACCESS]: {
    title: NO_ACCESS_TO_FORM_MESSAGE,
    message:
      'For å få tilgang må  du ta kontakt med daglig leder eller HR. Du trenger ressursen "Oppgi nærmeste leder for sykmeldt ansatt".',
  },
  [BackendErrorType.LINEMANAGER_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH]: {
    title: "Kombinasjonen av etternavn og fødselsnummer er feil",
    message:
      "Etternavnet du har fylt inn  for nærmeste leder stemmer ikke overens med oppgitt fødselsnummer. Sjekk at du har fylt inn riktig og prøv igjen.",
  },
  [BackendErrorType.EMPLOYEE_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH]: {
    title: "Kombinasjonen av etternavn og fødselsnummer er feil",
    message:
      "Etternavnet du har fylt inn  for den sykmeldte stemmer ikke overens med oppgitt fødselsnummer. Sjekk at du har fylt inn riktig og prøv igjen.",
  },
  [BackendErrorType.NO_ACTIVE_SICK_LEAVE]: {
    title: "Den ansatte er ikke sykmeldt",
    message:
      "For å kunne oppgi nærmeste leder for en ansatt må den ansatte være sykmeldt, og ha en aktiv sykmelding.",
  },
  [BackendErrorType.EMPLOYEE_MISSING_EMPLOYMENT_IN_ORG]: {
    title: "Den sykmeldte tilhører ikke organisasjonen",
    message:
      "Den sykmeldte er ikke ansatt i oppgitt organisasjon. Kontroller at du har fylt inn riktig kombinasjon.",
  },
  [BackendErrorType.LINEMANAGER_MISSING_EMPLOYMENT_IN_ORG]: {
    title: "Nærmeste leder tilhører ikke organisasjonen",
    message:
      "Personen som oppgis som nærmeste leder må tilhøre samme organisasjon som den sykmeldte.",
  },
};

const backendErrorTypeSchema = z.enum(BackendErrorType);

const backendErrorSchema = z.object({
  type: backendErrorTypeSchema.optional(),
  message: z.string().optional(),
});

const NARMESTE_LEDER_FALLBACK_ERROR_MESSAGE =
  "Vi klarte ikke å gjennomføre handlingen. Prøv igjen senere.";

export const NARMESTE_LEDER_FALLBACK_ERROR_DETAIL: ErrorDetail = {
  title: "Beklager! Det har oppstått en uventet feil",
  message: NARMESTE_LEDER_FALLBACK_ERROR_MESSAGE,
};

export type BackendErrorPayload = z.infer<typeof backendErrorSchema>;

export type ErrorDetail = {
  title: string;
  message: string;
};

export type FrontendErrorResponse = {
  type?: BackendErrorType;
  errorDetail: ErrorDetail;
};

export type FrontendError = Error & { errorDetail: ErrorDetail };

const createFrontendError = (errorDetail: ErrorDetail): FrontendError => {
  const error = new Error(errorDetail.message) as FrontendError;
  error.name = "FrontendError";
  error.errorDetail = errorDetail;
  return error;
};

export const isFrontendError = (error: unknown): error is FrontendError =>
  error instanceof Error && error.name === "FrontendError";

const toTranslatedError = (payload?: BackendErrorPayload): ErrorDetail => {
  if (!payload) {
    return NARMESTE_LEDER_FALLBACK_ERROR_DETAIL;
  }

  const { type } = payload;
  return type ? errorTypeToDetail[type] : NARMESTE_LEDER_FALLBACK_ERROR_DETAIL;
};

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
  } catch (error) {
    logger.error(
      `Failed to parse backend error response as JSON: ${
        error instanceof Error ? error.message : String(error)
      } - body=${rawBody.slice(0, 200)}`,
    );
  }

  return undefined;
};

export const toFrontendError = async (
  response: Response,
): Promise<FrontendError | Error> => {
  const backendErrorPayload = await parseBackendErrorPayload(response);

  if (!backendErrorPayload?.type) {
    return new Error("Det oppstod en feil.");
  }
  return createFrontendError(toTranslatedError(backendErrorPayload));
};

export const toFrontendErrorResponse = async (
  response: Response,
): Promise<FrontendErrorResponse> => {
  const backendErrorPayload = await parseBackendErrorPayload(response);

  return {
    type: backendErrorPayload?.type,
    errorDetail: toTranslatedError(backendErrorPayload),
  };
};
