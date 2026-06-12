import type { LineManagerRequirementsList } from "@/schemas/lineManagerRequirementsListSchema";

/**
 * Mockdata for oversikt over sykmeldte ansatte.
 * Dekker alle tre tab-tilstander: ingen leder, aktiv med leder, ikke aktiv.
 */
export const mockRequirementsList: LineManagerRequirementsList = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    employeeIdentificationNumber: "26095514420",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: null,
    name: { firstName: "Kari", lastName: "Nordmann", middleName: null },
    isActive: true,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    employeeIdentificationNumber: "19048938755",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: null,
    name: { firstName: "Ole", lastName: "Hansen", middleName: "Kristian" },
    isActive: true,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    employeeIdentificationNumber: "12057932464",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: "26095514420",
    name: { firstName: "Ingrid", lastName: "Berg", middleName: null },
    isActive: true,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    employeeIdentificationNumber: "07068718054",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: "19048938755",
    name: { firstName: "Lars", lastName: "Johansen", middleName: null },
    isActive: false,
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    employeeIdentificationNumber: "08084312345",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: null,
    name: { firstName: "Silje", lastName: "Pedersen", middleName: null },
    isActive: false,
  },
];
