import { describe, expect, it } from "vitest";
import { findOrganisasjonNavn } from "./findOrganisasjonNavn";

describe("findOrganisasjonNavn", () => {
  const organisasjoner = [
    {
      orgnr: "811076732",
      navn: "Havna Holding AS",
      underenheter: [
        {
          orgnr: "963890095",
          navn: "Shark AS",
          underenheter: [],
        },
      ],
    },
  ];

  it("finds an organisation name in nested organisations", () => {
    expect(findOrganisasjonNavn("963890095", organisasjoner)).toBe("Shark AS");
  });

  it("returns an empty string when the organisation is not accessible", () => {
    expect(findOrganisasjonNavn("000000000", organisasjoner)).toBe("");
  });
});
