import { describe, expect, it } from "vitest";
import { getSafeReturnTo } from "@/app/(registrering)/utils/returnTo";

const BASE = "/arbeidsgiver/ansatte/narmesteleder";

describe("getSafeReturnTo", () => {
  it("returns full path when input already has basePath prefix", () => {
    expect(
      getSafeReturnTo(`${BASE}/oversikt?orgnr=912345678&tab=aktiv-sykmelding`),
    ).toBe(`${BASE}/oversikt?orgnr=912345678&tab=aktiv-sykmelding`);
  });

  it("prepends basePath when input is a relative path", () => {
    expect(
      getSafeReturnTo("/oversikt?orgnr=912345678&tab=aktiv-sykmelding"),
    ).toBe(`${BASE}/oversikt?orgnr=912345678&tab=aktiv-sykmelding`);
  });

  it("returns null for missing returnTo", () => {
    expect(getSafeReturnTo(undefined)).toBeNull();
  });

  it("returns null for external URL", () => {
    expect(getSafeReturnTo("https://example.com/evil")).toBeNull();
  });

  it("returns null for protocol-relative URL", () => {
    expect(getSafeReturnTo("//example.com/evil")).toBeNull();
  });
});
