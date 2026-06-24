import type { LineManagerReadResponse } from "@/schemas/lineManagerReadSchema";

export const mockLineManagerRequirement: LineManagerReadResponse = {
  id: "123456",
  employeeIdentificationNumber: "26895514420",
  orgNumber: "963890095",
  orgName: "Shark AS",
  mainOrgNumber: "123456789",
  managerIdentificationNumber: "19848938755",
  name: {
    firstName: "John",
    lastName: "Doe",
    middleName: "Muller",
  },
};
