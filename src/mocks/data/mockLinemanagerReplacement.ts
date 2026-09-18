import { mockLinemanagerSearchActive } from "@/mocks/data/mockLinemanagerSearch";
import type { LineManagerReplacementReadResponse } from "@/schemas/lineManagerReadSchema";

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
    lastName: relation.employee.name.lastName,
  };
};
