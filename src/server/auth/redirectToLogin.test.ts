import { describe, expect, it } from "vitest";
import { getRedirectAfterLoginUrlForLinemanagerReplacement } from "./redirectToLogin";

const BASE = "/arbeidsgiver/ansatte/narmesteleder";
const LINEMANAGER_ID = "11111111-1111-4111-8111-111111111111";

describe("getRedirectAfterLoginUrlForLinemanagerReplacement", () => {
  it("preserves a safe return path", () => {
    expect(
      getRedirectAfterLoginUrlForLinemanagerReplacement(
        LINEMANAGER_ID,
        "/oversikt?orgnr=912345678&tab=aktiv-sykmelding",
      ),
    ).toBe(
      `${BASE}/endre/${LINEMANAGER_ID}?returnTo=%2Farbeidsgiver%2Fansatte%2Fnarmesteleder%2Foversikt%3Forgnr%3D912345678%26tab%3Daktiv-sykmelding`,
    );
  });

  it("drops an unsafe return path", () => {
    expect(
      getRedirectAfterLoginUrlForLinemanagerReplacement(
        LINEMANAGER_ID,
        "https://example.com",
      ),
    ).toBe(`${BASE}/endre/${LINEMANAGER_ID}`);
  });
});
