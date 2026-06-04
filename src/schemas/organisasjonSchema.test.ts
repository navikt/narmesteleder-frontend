import { describe, expect, it } from "vitest";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import { organisasjonerSchema } from "@/schemas/organisasjonSchema";

describe("organisasjonerSchema", () => {
  it("aksepterer et gyldig organisasjonstre i wrapper-objekt", () => {
    const result = organisasjonerSchema.safeParse({
      organisasjoner: mockOrganisasjoner,
    });

    expect(result.success).toBe(true);
  });

  it("avviser gammel backend-shape med top-level array", () => {
    const result = organisasjonerSchema.safeParse(mockOrganisasjoner);

    expect(result.success).toBe(false);
  });

  it("avviser organisasjoner uten underenheter i wrapper-objekt", () => {
    const result = organisasjonerSchema.safeParse({
      organisasjoner: [
        {
          orgnr: "811076732",
          navn: "Havna Holding AS",
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
