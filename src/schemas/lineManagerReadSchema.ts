import { object, string, z } from 'zod'

export const employeeSchema = object({
  firstName: string(),
  lastName: string(),
  middleName: string().nullish(),
})

export const lineManagerReadSchema = object({
  id: string(),
  employeeIdentificationNumber: string(),
  orgnumber: string(),
  mainOrgnumber: string(),
  managerIdentificationNumber: string(),
  name: employeeSchema,
})

export type LineManagerReadResponse = z.infer<typeof lineManagerReadSchema>

export type EmployeeResponse = z.infer<typeof employeeSchema>
