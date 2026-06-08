import { describe, expect, it } from "vitest";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import {
  type AccessibleOrganizationResponse,
  accessibleOrganizationsResponseSchema,
} from "@/schemas/organisasjonSchema";

const toAccessibleOrganization = ({
  orgnr,
  navn,
  underenheter,
}: (typeof mockOrganisasjoner)[number]): AccessibleOrganizationResponse => ({
  orgNumber: orgnr,
  name: navn,
  subOrganizations: underenheter.map(toAccessibleOrganization),
});

describe("accessibleOrganizationsResponseSchema", () => {
  it("aksepterer et gyldig organisasjonstre i wrapper-objekt", () => {
    const result = accessibleOrganizationsResponseSchema.safeParse({
      organizations: mockOrganisasjoner.map(toAccessibleOrganization),
    });

    expect(result.success).toBe(true);
  });

  it("avviser gammel backend-shape med top-level array", () => {
    const result =
      accessibleOrganizationsResponseSchema.safeParse(mockOrganisasjoner);

    expect(result.success).toBe(false);
  });

  it("avviser organisasjoner uten underenheter i wrapper-objekt", () => {
    const result = accessibleOrganizationsResponseSchema.safeParse({
      organizations: [
        {
          orgNumber: "811076732",
          name: "Havna Holding AS",
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
