import { z } from 'zod'

export const registerNarmesteLederSchema = z.object({
  sykmeldt: z.object({
    navn: z.string().min(1, 'Navn er påkrevd'),
    fodselsnummer: z.string().regex(/^\d{11}$/, 'Fødselsnummer må være 11 sifre'),
  }),
  leder: z.object({
    fodselsnummer: z.string().regex(/^\d{11}$/, 'Fødselsnummer må være 11 sifre'),
    fornavn: z.string().min(1, 'Fornavn er påkrevd'),
    etternavn: z.string().min(1, 'Etternavn er påkrevd'),
    // Norske mobilnumre er 8 sifre, men juster om du trenger annet
    mobilnummer: z.string().regex(/^\d{8}$/, 'Mobilnummer må være 8 sifre'),
    epost: z.string().email('Ugyldig e-postadresse'),
  }),
})
export type NarmesteLederForm = z.infer<typeof registerNarmesteLederSchema>

export const narmesteLederFormDefaults: NarmesteLederForm = {
  sykmeldt: {
    navn: '',
    fodselsnummer: '',
  },
  leder: {
    fodselsnummer: '',
    fornavn: '',
    etternavn: '',
    mobilnummer: '',
    epost: '',
  },
} satisfies NarmesteLederForm
