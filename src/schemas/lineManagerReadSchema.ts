import { object, string, uuid, type z } from "zod";

export const nameSchema = object({
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
  name: nameSchema,
});

export type LineManagerReadResponse = z.infer<typeof lineManagerReadSchema>;

export type EmployeeName = z.infer<typeof nameSchema>;

export type LineManagerReplacementReadResponse = z.infer<
  typeof replacementSchema
>;

export const replacementSchema = object({
  linemanagerRelation: object({
    id: uuid(),
    employee: object({
      nationalIdentificationNumber: string(),
      name: nameSchema,
    }),
    organization: object({
      orgNumber: string(),
      name: string(),
    }),
  }),
});
