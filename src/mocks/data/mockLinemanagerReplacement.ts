import type { Organisasjon } from "@navikt/virksomhetsvelger";
import { mockLinemanagerSearchActive } from "@/mocks/data/mockLinemanagerSearch";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import type { LineManagerReplacementReadResponse } from "@/schemas/lineManagerReadSchema";

const findOrganizationName = (
  orgNumber: string,
  organizations: Organisasjon[],
): string | null => {
  for (const organization of organizations) {
    if (organization.orgnr === orgNumber) {
      return organization.navn;
    }

    const subOrganizationName = findOrganizationName(
      orgNumber,
      organization.underenheter,
    );
    if (subOrganizationName) {
      return subOrganizationName;
    }
  }

  return null;
};

export const getMockLinemanagerReplacement = (
  linemanagerId: string,
): LineManagerReplacementReadResponse | null => {
  const relation = mockLinemanagerSearchActive.linemanagers.find(
    ({ linemanagerId: activeLinemanagerId }) =>
      activeLinemanagerId === linemanagerId,
  );

  if (!relation?.employee.name) {
    return null;
  }

  return {
    employeeIdentificationNumber:
      relation.employee.nationalIdentificationNumber,
    orgNumber: relation.orgNumber,
    orgName: findOrganizationName(relation.orgNumber, mockOrganisasjoner),
    name: {
      lastName: relation.employee.name.lastName,
    },
  };
};
