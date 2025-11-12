import { object, string, z } from "zod";

export const employeeSchema = object({
  firstName: string(),
  lastName: string(),
  middleName: string().nullable(),
});

export const lineManagerReadSchema = object({
  id: string(),
  employeeIdentificationNumber: string(),
  orgNumber: string(),
  orgName: string().nullable(),
  mainOrgNumber: string(),
  managerIdentificationNumber: string(),
  name: employeeSchema,
});

export type LineManagerReadResponse = z.infer<typeof lineManagerReadSchema>;

export type EmployeeResponse = z.infer<typeof employeeSchema>;
