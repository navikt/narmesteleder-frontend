import { describe, expect, it } from "vitest";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import { organisasjonerSchema } from "@/schemas/organisasjonSchema";

describe("organisasjonerSchema", () => {
  it("aksepterer et gyldig organisasjonstre", () => {
    const result = organisasjonerSchema.safeParse(mockOrganisasjoner);

    expect(result.success).toBe(true);
  });

  it("avviser organisasjoner uten underenheter", () => {
    const result = organisasjonerSchema.safeParse([
      {
        orgnr: "811076732",
        navn: "Havna Holding AS",
      },
    ]);

    expect(result.success).toBe(false);
  });
});
