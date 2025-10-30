import { email, object, string, z } from 'zod'

import { fnr } from '@navikt/fnrvalidator'
import { isNonProd } from '@/env-variables/envHelpers'

const requireFieldErrorMessage = 'Feltet er påkrevd'
const invalidEmailErrorMessage = 'Ugyldig e-postadresse'
const lengthOrgnummerMessage = 'Organisasjonsnummer må være 9 siffer'
const invalidFnrErrorMessage = 'Fødselsnummeret er ikke gyldig'
const requiredFnrErrorMessage = 'Fødselsnummeret er påkrevd'

const validateFnr = (value: string): boolean => {
  if (!/^\d{11}$/.test(value)) return false

  if (isNonProd) return true

  return fnr(value).status === 'valid'
}

export const FnrSchema = z.string().trim().nonempty(requiredFnrErrorMessage).refine(validateFnr, {
  message: invalidFnrErrorMessage,
})

export const narmesteLederFormSchema = object({
  fodselsnummer: FnrSchema,
  mobilnummer: string().nonempty(requireFieldErrorMessage),
  epost: email(invalidEmailErrorMessage).nonempty(requireFieldErrorMessage),
  fornavn: string().nonempty(requireFieldErrorMessage),
  etternavn: string().nonempty(requireFieldErrorMessage),
})

export type NarmesteLederForm = z.infer<typeof narmesteLederFormSchema>

export const sykmeldtFormSchema = object({
  fodselsnummer: FnrSchema,
  orgnummer: string().nonempty(requireFieldErrorMessage).length(9, lengthOrgnummerMessage),
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

export const lederOnlySchema = narmesteLederInfoSchema.pick({ leder: true })
export type LederOnly = Pick<NarmesteLederInfo, 'leder'>
export const lederOnlyDefaults: LederOnly = { leder: narmesteLederFormDefaults }
