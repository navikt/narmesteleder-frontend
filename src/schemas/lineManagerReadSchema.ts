import { object, string, type z } from "zod";

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
  managerIdentificationNumber: string().nullable(),
  name: employeeSchema,
});

export type LineManagerReadResponse = z.infer<typeof lineManagerReadSchema>;

export type EmployeeResponse = z.infer<typeof employeeSchema>;

export const lineManagerReplacementReadSchema = lineManagerReadSchema
  .pick({
    employeeIdentificationNumber: true,
    orgNumber: true,
    orgName: true,
    name: true,
  })
  .extend({
    name: employeeSchema.pick({ lastName: true }),
  });

export type LineManagerReplacementReadResponse = z.infer<
  typeof lineManagerReplacementReadSchema
>;
