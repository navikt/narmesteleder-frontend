import { createEventLogger } from "@navikt/esyfo-logger";
import { logger } from "@navikt/next-logger";
import { type ZodError, z } from "zod";
import { networkErrorCode } from "./networkErrorCode";
import {
  RuntimeErrorCode,
  type RuntimeErrorOperation,
  type RuntimeInputOperation,
  RuntimeValidationTarget,
  runtimeErrorContext,
  runtimeErrorDefinitions,
  runtimeInputWarnings,
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
    runtimeErrorDefinitions[operation],
    runtimeErrorContext(errorCode, upstreamStatus),
  );
}

export function logRuntimeNetworkError(
  operation: RuntimeErrorOperation,
  error: unknown,
): void {
  runtimeLog.event(runtimeErrorDefinitions[operation], {
    ...runtimeErrorContext(RuntimeErrorCode.NETWORK_ERROR),
    network_code: networkErrorCode(error),
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

export function logInvalidResponse(
  operation: RuntimeErrorOperation,
  validationError: ZodError,
  upstreamStatus?: number,
): void {
  runtimeLog.event(
    runtimeErrorDefinitions[operation],
    runtimeValidationContext(
      RuntimeErrorCode.INVALID_RESPONSE,
      RuntimeValidationTarget.UPSTREAM_RESPONSE,
      validationError,
      upstreamStatus,
    ),
  );
}

export function logInvalidInput(
  operation: RuntimeInputOperation,
  validationTarget: RuntimeValidationTarget,
  validationError: ZodError,
): void {
  runtimeLog.event(
    runtimeInputWarnings[operation],
    runtimeValidationContext(
      RuntimeErrorCode.INVALID_INPUT,
      validationTarget,
      validationError,
    ),
  );
}
