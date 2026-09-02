import { logger } from "@navikt/next-logger";
import { type ZodError, z } from "zod";
import {
  getRuntimeErrorMessage,
  type RuntimeErrorCode,
  type RuntimeErrorOperation,
  runtimeErrorContext,
} from "./runtimeErrorContract";

export const RuntimeValidationTarget = {
  NARMESTE_LEDER_INFO: "narmeste_leder_info",
  REQUIREMENT_ID: "requirement_id",
  NARMESTE_LEDER_FORM: "narmeste_leder_form",
  REVOKE_REQUEST: "revoke_request",
  UPSTREAM_RESPONSE: "upstream_response",
} as const;

type RuntimeValidationTarget =
  (typeof RuntimeValidationTarget)[keyof typeof RuntimeValidationTarget];

/**
 * Logger bare felt fra den lukkede runtime-kontrakten. Dynamiske feilobjekter,
 * URL-er og request-data er med vilje ikke parametere.
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

const runtimeValidationContext = (
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  validationTarget: RuntimeValidationTarget,
  validationError: ZodError,
) => ({
  ...runtimeErrorContext(operation, errorCode),
  validation_target: validationTarget,
  validationIssues: z.prettifyError(validationError),
});

export function logRuntimeValidationError(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  validationTarget: RuntimeValidationTarget,
  validationError: ZodError,
): void {
  logger.error(
    runtimeValidationContext(
      operation,
      errorCode,
      validationTarget,
      validationError,
    ),
    getRuntimeErrorMessage(operation),
  );
}

export function logRuntimeValidationWarning(
  operation: RuntimeErrorOperation,
  errorCode: RuntimeErrorCode,
  validationTarget: RuntimeValidationTarget,
  validationError: ZodError,
): void {
  logger.warn(
    runtimeValidationContext(
      operation,
      errorCode,
      validationTarget,
      validationError,
    ),
    getRuntimeErrorMessage(operation),
  );
}
