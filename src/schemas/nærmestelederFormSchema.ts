import { email, object, string, z } from 'zod'

const requireFieldErrorMessage = 'Feltet er påkrevd'

// TODO validate Norwegian phone number, org-number and fnr formats
export const narmesteLederFormSchema = object({
  fodselsnummer: string().nonempty(requireFieldErrorMessage),
  mobilnummer: string().nonempty(requireFieldErrorMessage),
  epost: email().nonempty(requireFieldErrorMessage),
  fornavn: string().nonempty(requireFieldErrorMessage),
  etternavn: string().nonempty(requireFieldErrorMessage),
})

export type NarmesteLederForm = z.infer<typeof narmesteLederFormSchema>

export const sykmeldtFormSchema = object({
  fodselsnummer: string().nonempty(requireFieldErrorMessage),
  orgnummer: string().nonempty(),
})

export type SykmeldtForm = z.infer<typeof sykmeldtFormSchema>

export const narmesteLederInfoSchema = object({
  sykmeldt: sykmeldtFormSchema,
  leder: narmesteLederFormSchema,
})

export type NarmesteLederInfo = z.infer<typeof narmesteLederInfoSchema>

export const sykmeldtFormDefaults: SykmeldtForm = {
  fodselsnummer: '',
  orgnummer: '',
} satisfies SykmeldtForm

export const narmesteLederFormDefaults: NarmesteLederForm = {
  fodselsnummer: '',
  mobilnummer: '',
  epost: '',
  fornavn: '',
  etternavn: '',
} satisfies NarmesteLederForm

export const narmesteLederInfoDefaults = {
  sykmeldt: sykmeldtFormDefaults,
  leder: narmesteLederFormDefaults,
} satisfies NarmesteLederInfo
