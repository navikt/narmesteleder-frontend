import { z } from "zod";
import { logger } from "@navikt/next-logger";

enum BackendErrorType {
  FORBIDDEN_LACKS_ORG_ACCESS = "FORBIDDEN_LACKS_ORG_ACCESS",
  FORBIDDEN_LACKS_ALITINN_RESOURCE_ACCESS = "FORBIDDEN_LACKS_ALITINN_RESOURCE_ACCESS",
  BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER = "BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER",
  BAD_REQUEST_NAME_NIN_MISMATCH_EMPLOYEE = "BAD_REQUEST_NAME_NIN_MISMATCH_EMPLOYEE",
  BAD_REQUEST_NO_ACTIVE_SICK_LEAVE = "BAD_REQUEST_NO_ACTIVE_SICK_LEAVE",
}

const NO_ACCESS_TO_FORM_MESSAGE =
  "Du har ikke tilgang til å åpne dette skjemaet";

const typeToMessage: Record<BackendErrorType, ErrorDetail> = {
  [BackendErrorType.FORBIDDEN_LACKS_ORG_ACCESS]: {
    title: NO_ACCESS_TO_FORM_MESSAGE,
    message:
      "Du har ikke tilgang til denne organisasjonen. For å få tilgang må du ta kontakt med daglig leder eller HR.",
  },
  [BackendErrorType.FORBIDDEN_LACKS_ALITINN_RESOURCE_ACCESS]: {
    title: NO_ACCESS_TO_FORM_MESSAGE,
    message:
      'For å få tilgang må  du ta kontakt med daglig leder eller HR. Du trenger ressursen "Oppgi nærmeste leder for sykmeldt ansatt".',
  },
  [BackendErrorType.BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER]: {
    title: "Kombinasjonen av etternavn og fødselsnummer er feil",
    message:
      "Etternavnet du har fylt inn  for nærmeste leder stemmer ikke overens med oppgitt fødselsnummer. Sjekk at du har fylt inn riktig og prøv igjen.",
  },
  [BackendErrorType.BAD_REQUEST_NAME_NIN_MISMATCH_EMPLOYEE]: {
    title: "Kombinasjonen av etternavn og fødselsnummer er feil",
    message:
      "Etternavnet du har fylt inn  for den sykmeldte stemmer ikke overens med oppgitt fødselsnummer. Sjekk at du har fylt inn riktig og prøv igjen.",
  },
  [BackendErrorType.BAD_REQUEST_NO_ACTIVE_SICK_LEAVE]: {
    title: "Den ansatte er ikke sykmeldt",
    message:
      "For å kunne oppgi nærmeste leder for en ansatt må den ansatte være sykmeldt, og ha en aktiv sykmelding.",
  },
};

const backendErrorTypeSchema = z.union([
  z.literal(BackendErrorType.FORBIDDEN_LACKS_ORG_ACCESS),
  z.literal(BackendErrorType.FORBIDDEN_LACKS_ALITINN_RESOURCE_ACCESS),
  z.literal(BackendErrorType.BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER),
  z.literal(BackendErrorType.BAD_REQUEST_NAME_NIN_MISMATCH_EMPLOYEE),
]);

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

export type FrontendError = {
  type?: BackendErrorType;
  errorDetail: ErrorDetail;
};

async function parseBackendErrorPayload(
  response: Response,
): Promise<BackendErrorPayload | undefined> {
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
}

function toTranslatedError(payload?: BackendErrorPayload): ErrorDetail {
  if (!payload) {
    return NARMESTE_LEDER_FALLBACK_ERROR_DETAIL;
  }

  const { type } = payload;
  return type ? typeToMessage[type] : NARMESTE_LEDER_FALLBACK_ERROR_DETAIL;
}

export async function toFrontendError(
  response: Response,
): Promise<FrontendError> {
  const backendErrorPayload = await parseBackendErrorPayload(response);

  return {
    type: backendErrorPayload?.type,
    errorDetail: toTranslatedError(backendErrorPayload),
  };
}
