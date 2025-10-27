import { RegisterRequest } from '@/services/narmesteleder/schemas/formSchema'

// TODO zod
export const narmestelederFormDefaults = {
  sykmeldt: { navn: '', fodselsnummer: '' },
  leder: { fodselsnummer: '', fornavn: '', etternavn: '', mobilnummer: '', epost: '' },
} satisfies RegisterRequest
