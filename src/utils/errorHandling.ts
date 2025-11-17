import { logger } from "@navikt/next-logger";

export function logErrorMessageAndThrowError(logMessage: string): never {
  logger.error(logMessage);
  throw new Error("Det oppstod en feil ved henting av data.");
}
