import { mockLinemanagerSearchActive } from "@/mocks/data/mockLinemanagerSearch";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import type { LineManagerReplacementReadResponse } from "@/schemas/lineManagerReadSchema";
import { findOrganisasjonNavn } from "@/utils/findOrganisasjonNavn";

export const getMockLinemanagerReplacement = (
  linemanagerId: string,
): LineManagerReplacementReadResponse | null => {
  const relation = mockLinemanagerSearchActive.linemanagers.find(
    ({ linemanagerId: activeLinemanagerId }) =>
      activeLinemanagerId === linemanagerId,
  );

  if (!relation) {
    return null;
  }

  return {
    linemanagerRelation: {
      id: relation.linemanagerId,
      employee: {
        nationalIdentificationNumber:
          relation.employee.nationalIdentificationNumber,
        name: relation.employee.name,
      },
      organization: {
        orgNumber: relation.orgNumber,
        name: findOrganisasjonNavn(relation.orgNumber, mockOrganisasjoner),
      },
    },
  };
};
