import { logger } from "@navikt/next-logger";
import {
  getRuntimeErrorMessage,
  type RuntimeErrorCode,
  type RuntimeErrorOperation,
  runtimeErrorContext,
} from "./runtimeErrorContract";

/**
 * Logger bare felt fra den lukkede runtime-kontrakten. Dynamiske feilobjekter,
 * URL-er, request-data og valideringsdetaljer er med vilje ikke parametere.
 */
export function logRuntimeError(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  upstreamStatus?: number,
): void {
  logger.error(
    runtimeErrorContext(operation, errorCode, upstreamStatus),
    getRuntimeErrorMessage(operation),
  );
}

/** Forventede, men diagnostisk nyttige avvisninger bruker samme lukkede felt. */
export function logRuntimeWarning(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
): void {
  logger.warn(
    runtimeErrorContext(operation, errorCode),
    getRuntimeErrorMessage(operation),
  );
}
