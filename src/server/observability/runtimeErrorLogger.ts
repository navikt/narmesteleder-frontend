import { createEventLogger } from "@navikt/esyfo-logger";
import { logger } from "@navikt/next-logger";
import { type ZodError, z } from "zod";
import { networkErrorCause } from "./networkErrorCause";
import {
  RuntimeErrorCode,
  type RuntimeErrorOperation,
  type RuntimeValidationTarget,
  runtimeErrorContext,
  runtimeErrorDefinitions,
} from "./runtimeErrorContract";

export { RuntimeValidationTarget } from "./runtimeErrorContract";

const runtimeLog = createEventLogger(logger);

/**
 * Logger bare felt fra den lukkede runtime-kontrakten. Dynamiske feilobjekter,
 * URL-er og request-data er med vilje ikke parametere.
 */
export function logRuntimeError(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  upstreamStatus?: number,
): void {
  runtimeLog.event(
    runtimeErrorDefinitions[operation].error,
    runtimeErrorContext(errorCode, upstreamStatus),
  );
}

export function logRuntimeNetworkError(
  operation: RuntimeErrorOperation,
  error: unknown,
): void {
  runtimeLog.event(runtimeErrorDefinitions[operation].error, {
    ...runtimeErrorContext(RuntimeErrorCode.NETWORK_ERROR),
    network_cause: networkErrorCause(error),
  });
}

const runtimeValidationContext = (
  errorCode: RuntimeErrorCode,
  validationTarget: RuntimeValidationTarget,
  validationError: ZodError,
  upstreamStatus?: number,
) => ({
  ...runtimeErrorContext(errorCode, upstreamStatus),
  validation_target: validationTarget,
  validationIssues: z.prettifyError(validationError),
});

export function logRuntimeValidationError(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  validationTarget: RuntimeValidationTarget,
  validationError: ZodError,
  upstreamStatus?: number,
): void {
  runtimeLog.event(
    runtimeErrorDefinitions[operation].error,
    runtimeValidationContext(
      errorCode,
      validationTarget,
      validationError,
      upstreamStatus,
    ),
  );
}

export function logRuntimeValidationWarning(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  validationTarget: RuntimeValidationTarget,
  validationError: ZodError,
): void {
  runtimeLog.event(
    runtimeErrorDefinitions[operation].validationWarning,
    runtimeValidationContext(errorCode, validationTarget, validationError),
  );
}
