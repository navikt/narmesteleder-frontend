import { describe, expect, it } from "vitest";
import {
  getRuntimeErrorEvent,
  getRuntimeErrorMessage,
  RuntimeErrorCode,
  RuntimeErrorEvent,
  RuntimeErrorOperation,
  runtimeErrorContext,
} from "./runtimeErrorContract";

const expectedOperations = [
  {
    operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
    event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
    message: "Kunne ikke hente organisasjoner",
  },
  {
    operation: RuntimeErrorOperation.HENT_BEHOVSLISTE,
    event: RuntimeErrorEvent.BEHOVSLISTE_FETCH_FAILED,
    message: "Kunne ikke hente listen over behov for nærmeste leder",
  },
  {
    operation: RuntimeErrorOperation.HENT_BEHOV,
    event: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
    message: "Kunne ikke hente behovet for nærmeste leder",
  },
  {
    operation: RuntimeErrorOperation.SOK_NARMESTE_LEDERE,
    event: RuntimeErrorEvent.NARMESTE_LEDERE_SEARCH_FAILED,
    message: "Kunne ikke søke etter nærmeste ledere",
  },
  {
    operation: RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER,
    event: RuntimeErrorEvent.NARMESTE_LEDER_CREATE_FAILED,
    message: "Kunne ikke opprette nærmeste leder",
  },
  {
    operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
    event: RuntimeErrorEvent.NARMESTE_LEDER_UPDATE_FAILED,
    message: "Kunne ikke oppdatere nærmeste leder",
  },
  {
    operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
    event: RuntimeErrorEvent.NARMESTE_LEDER_REVOKE_FAILED,
    message: "Kunne ikke fjerne nærmeste leder",
  },
] as const;

describe("runtime error contract", () => {
  it("holder operasjoner, hendelser og meldinger lukkede og entydige", () => {
    const operations = Object.values(RuntimeErrorOperation);
    const events = Object.values(RuntimeErrorEvent);
    const errorCodes = Object.values(RuntimeErrorCode);

    expect(new Set(operations).size).toBe(operations.length);
    expect(new Set(events).size).toBe(events.length);
    expect(new Set(errorCodes).size).toBe(errorCodes.length);
    expect(expectedOperations).toHaveLength(operations.length);

    for (const { operation, event, message } of expectedOperations) {
      expect(getRuntimeErrorEvent(operation)).toBe(event);
      expect(getRuntimeErrorMessage(operation)).toBe(message);
      expect(operation).toMatch(/^[a-z][a-z0-9_.-]{0,79}$/);
      expect(event).toMatch(/^[a-z][a-z0-9_.-]{0,79}$/);
    }

    for (const errorCode of errorCodes) {
      expect(errorCode).toMatch(/^[A-Z][A-Z0-9_]{1,79}$/);
    }
  });

  it("tar bare med upstream_status når en reell HTTP-status finnes", () => {
    expect(
      runtimeErrorContext(
        RuntimeErrorOperation.HENT_BEHOV,
        RuntimeErrorCode.NETWORK_ERROR,
      ),
    ).toEqual({
      event_type: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOV,
      error_code: RuntimeErrorCode.NETWORK_ERROR,
    });

    expect(
      runtimeErrorContext(
        RuntimeErrorOperation.HENT_BEHOV,
        RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        403,
      ),
    ).toEqual({
      event_type: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOV,
      error_code: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      upstream_status: 403,
    });
  });

  it.each([99, 600, 200.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "utelater ugyldig upstream_status %s",
    (upstreamStatus) => {
      expect(
        runtimeErrorContext(
          RuntimeErrorOperation.HENT_BEHOV,
          RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
          upstreamStatus,
        ),
      ).not.toHaveProperty("upstream_status");
    },
  );
});
