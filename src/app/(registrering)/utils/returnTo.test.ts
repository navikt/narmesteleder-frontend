import { describe, expect, it } from "vitest";
import { getSafeReturnTo } from "@/app/(registrering)/utils/returnTo";

describe("getSafeReturnTo", () => {
  it("strips basePath prefix and returns relative path", () => {
    expect(
      getSafeReturnTo(
        "/arbeidsgiver/ansatte/narmesteleder/oversikt?orgnr=912345678&tab=aktiv-sykmelding",
      ),
    ).toBe("/oversikt?orgnr=912345678&tab=aktiv-sykmelding");
  });

  it("returns relative path as-is when already without basePath", () => {
    expect(
      getSafeReturnTo("/oversikt?orgnr=912345678&tab=aktiv-sykmelding"),
    ).toBe("/oversikt?orgnr=912345678&tab=aktiv-sykmelding");
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
