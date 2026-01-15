import type { LineManagerReadResponse } from "@/schemas/lineManagerReadSchema";

export const mockLineManagerRequirement: LineManagerReadResponse = {
  id: "123456",
  employeeIdentificationNumber: "26095514420",
  orgNumber: "963890095",
  orgName: "Shark AS",
  mainOrgNumber: "123456789",
  managerIdentificationNumber: "19048938755",
  name: {
    firstName: "John",
    lastName: "Doe",
    middleName: "Muller",
  },
};
