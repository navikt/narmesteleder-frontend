import { describe, expect, it } from "vitest";
import { getSafeReturnTo } from "@/app/(registrering)/utils/returnTo";

describe("getSafeReturnTo", () => {
  it("returns valid internal returnTo URL", () => {
    expect(
      getSafeReturnTo(
        "/arbeidsgiver/ansatte/narmesteleder/oversikt?orgnr=912345678&tab=aktiv-sykmelding",
      ),
    ).toBe(
      "/arbeidsgiver/ansatte/narmesteleder/oversikt?orgnr=912345678&tab=aktiv-sykmelding",
    );
  });

  it("returns null for missing returnTo", () => {
    expect(getSafeReturnTo(undefined)).toBeNull();
  });

  it("returns null for external URL", () => {
    expect(getSafeReturnTo("https://example.com/evil")).toBeNull();
  });

  it("returns null for unrelated internal path", () => {
    expect(getSafeReturnTo("/foo/bar")).toBeNull();
  });
});
