import { z } from "zod";
import { logger } from "@navikt/next-logger";

enum BackendErrorType {
  FORBIDDEN_LACKS_ORG_ACCESS = "FORBIDDEN_LACKS_ORG_ACCESS",
  FORBIDDEN_LACKS_ALITINN_RESOURCE_ACCESS = "FORBIDDEN_LACKS_ALITINN_RESOURCE_ACCESS",
  BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER = "BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER",
  BAD_REQUEST_NAME_NIN_MISMATCH_EMPLOYEE = "BAD_REQUEST_NAME_NIN_MISMATCH_EMPLOYEE",
}

export const NARMESTE_LEDER_FALLBACK_ERROR_MESSAGE =
  "Vi klarte ikke å gjennomføre handlingen. Prøv igjen senere.";

const typeToMessage: Record<BackendErrorType, string> = {
  [BackendErrorType.FORBIDDEN_LACKS_ORG_ACCESS]:
    "Du har ikke tilgang i organisasjonen. Ta kontakt med din leder eller HR for å få tilgang.",
  [BackendErrorType.FORBIDDEN_LACKS_ALITINN_RESOURCE_ACCESS]:
    "Du har ikke tilgang til å sende nærmeste leder informasjon. Du trenger tilgang til ressursen 'Nærmeste leder'.",
  [BackendErrorType.BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER]:
    "Etternavn av nærmeste leder stemmer ikke overens med registrert fødselsnummer.",
  [BackendErrorType.BAD_REQUEST_NAME_NIN_MISMATCH_EMPLOYEE]:
    "Etternavn av den ansatte stemmer ikke overens med registrert fødselsnummer.",
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

export type BackendErrorPayload = z.infer<typeof backendErrorSchema>;

export interface FrontendError {
  type?: BackendErrorType;
  translatedMessage: string;
}

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

function toTranslatedError(payload?: BackendErrorPayload): string {
  if (!payload) {
    return NARMESTE_LEDER_FALLBACK_ERROR_MESSAGE;
  }

  const { type } = payload;
  return type ? typeToMessage[type] : NARMESTE_LEDER_FALLBACK_ERROR_MESSAGE;
}

export async function toFrontendError(
  response: Response,
): Promise<FrontendError> {
  const backendErrorPayload = await parseBackendErrorPayload(response);

  return {
    type: backendErrorPayload?.type,
    translatedMessage: toTranslatedError(backendErrorPayload),
  };
}
