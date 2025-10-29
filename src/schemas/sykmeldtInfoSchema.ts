import { object, string, z } from 'zod'

export const sykmeldtSchema = object({
  firstName: string(),
  lastName: string(),
  middleName: string().nullish(),
})

export const sykmeldtInfoSchema = object({
  id: string(),
  sykmeldtFnr: string(),
  orgnummer: string(),
  hovedenhetOrgnummer: string(),
  narmesteLederFnr: string(),
  name: sykmeldtSchema,
})

export type SykmeldtInfoResponse = z.infer<typeof sykmeldtInfoSchema>

export type SykmeldtResponse = z.infer<typeof sykmeldtSchema>
