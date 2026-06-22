import type { LineManagerRequirementsList } from "@/schemas/lineManagerRequirementsListSchema";

/**
 * Mockdata for oversikt over sykmeldte ansatte.
 * Dekker alle tre tab-tilstander: ingen leder, aktiv med leder, ikke aktiv.
 */
export const mockRequirementsList: LineManagerRequirementsList = [
  {
    id: "699e9702-b042-493d-8c20-a02c7c6c86ba",
    employeeIdentificationNumber: "26095514420",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: null,
    name: { firstName: "Kari", lastName: "Nordmann", middleName: null },
    isActive: true,
  },
  {
    id: "14484846-b69b-49fe-95d6-23ff820afddf",
    employeeIdentificationNumber: "19048938755",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: null,
    name: { firstName: "Ole", lastName: "Hansen", middleName: "Kristian" },
    isActive: true,
  },
  {
    id: "05bf9732-78de-4c7e-ae1c-bee755d515c6",
    employeeIdentificationNumber: "12057932464",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: "26095514420",
    name: { firstName: "Ingrid", lastName: "Berg", middleName: null },
    isActive: true,
  },
  {
    id: "fc897d5d-2f7c-4c4b-8c01-09d53c84428e",
    employeeIdentificationNumber: "07068718054",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: "19048938755",
    name: { firstName: "Lars", lastName: "Johansen", middleName: null },
    isActive: false,
  },
  {
    id: "8e1e3a99-e953-4d14-ad2a-c0f2755884b5",
    employeeIdentificationNumber: "08084312345",
    orgNumber: "963890095",
    orgName: "Shark AS",
    mainOrgNumber: "811076732",
    managerIdentificationNumber: null,
    name: { firstName: "Silje", lastName: "Pedersen", middleName: null },
    isActive: false,
  },
];
