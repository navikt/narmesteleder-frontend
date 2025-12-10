import { logger } from "@navikt/next-logger";

export function logErrorMessageAndThrowError(
  logMessage: string,
  error?: unknown,
): never {
  logger.error(logMessage);
  if (error) {
    throw error;
  }
  throw new Error("Det oppstod en feil ved henting av data.");
}
