import {
  RuntimeErrorCode,
  RuntimeErrorOperation,
} from "@/server/observability/runtimeErrorContract";
import { logRuntimeError } from "@/server/observability/runtimeErrorLogger";

/** Feilobjektet er med vilje ikke en parameter: klientlogger skal være statisk. */
export function logUnhandledFrontendError(): void {
  logRuntimeError(
    RuntimeErrorOperation.VIS_GENERELL_FEILSIDE,
    RuntimeErrorCode.UNHANDLED_ERROR,
  );
}
