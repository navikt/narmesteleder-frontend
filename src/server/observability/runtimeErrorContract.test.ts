import { describe, expect, it } from "vitest";
import {
  RuntimeErrorCode,
  RuntimeErrorOperation,
  runtimeErrorContext,
  runtimeErrorDefinitions,
  runtimeInputWarnings,
} from "./runtimeErrorContract";

describe("runtime error contract", () => {
  it("har en operasjonskatalog som samsvarer med feilhendelsene", () => {
    expect(Object.values(RuntimeErrorOperation).sort()).toEqual(
      Object.keys(runtimeErrorDefinitions).sort(),
    );
  });

  it("kobler hver operasjon til en unik feilhendelse", () => {
    const events = Object.values(runtimeErrorDefinitions);
    expect(new Set(events.map((event) => event.name)).size).toBe(events.length);
    for (const [operation, event] of Object.entries(runtimeErrorDefinitions)) {
      expect(event.operation).toBe(operation);
      expect(event.level).toBe("error");
    }
    expect(
      runtimeErrorDefinitions.hent_narmeste_leder_for_erstatning,
    ).toMatchObject({
      operation: "hent_narmeste_leder_for_erstatning",
      name: "linemanager_replacement_fetch_failed",
      message: "Kunne ikke hente nærmeste leder for erstatning",
    });
  });

  it("har input-advarsler bare for opprett, oppdater og fjern", () => {
    expect(Object.keys(runtimeInputWarnings).sort()).toEqual([
      "fjern_narmeste_leder",
      "oppdater_narmeste_leder",
      "opprett_narmeste_leder",
    ]);
    for (const [operation, warning] of Object.entries(runtimeInputWarnings)) {
      expect(warning).toEqual({
        ...runtimeErrorDefinitions[
          operation as keyof typeof runtimeInputWarnings
        ],
        level: "warn",
      });
    }
  });

  it("tar bare med upstream_status når en reell HTTP-status finnes", () => {
    expect(runtimeErrorContext(RuntimeErrorCode.NETWORK_ERROR)).toEqual({
      error_code: RuntimeErrorCode.NETWORK_ERROR,
    });
    expect(
      runtimeErrorContext(RuntimeErrorCode.UPSTREAM_HTTP_ERROR, 403),
    ).toEqual({
      error_code: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      upstream_status: 403,
    });
  });

  it.each([0, 99, 600, 200.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "utelater ugyldig upstream_status %s",
    (upstreamStatus) => {
      expect(
        runtimeErrorContext(
          RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
          upstreamStatus,
        ),
      ).not.toHaveProperty("upstream_status");
    },
  );
});
