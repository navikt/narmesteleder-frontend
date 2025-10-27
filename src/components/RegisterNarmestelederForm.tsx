'use client'

import { useState } from 'react'
import { revalidateLogic } from '@tanstack/react-form'
import { z } from 'zod'
import { Alert, Button, Fieldset, Heading } from '@navikt/ds-react'
import { RegisterRequest, SykmeldtPost } from '@/services/narmesteleder/schemas/formSchema'
import { useAppForm } from '@/hooks/form'
import { narmestelederFormDefaults } from '@/narmestelederForm'
import { logger } from '@navikt/next-logger'

// --- API ---
const clientPostRegisterLeader = async (body: RegisterRequest): Promise<string> => {
  // TODO mapping and sending to backend
  return 'done'
}

// --- Zod schema (runtime validation) ---
const registerSchema = z.object({
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

// OPTIONAL: if your RegisterRequest type matches the schema, this asserts parity at compile time
type FormValues = RegisterRequest & z.infer<typeof registerSchema>

export type RegisterNarmestelederFormProps = {
  initialSykmeldt?: SykmeldtPost
  prefillError?: string
}

export default function RegisterNarmestelederForm({ initialSykmeldt, prefillError }: RegisterNarmestelederFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const form = useAppForm({
    defaultValues: narmestelederFormDefaults,
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),

    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(false)
        setSubmitting(true)
        await clientPostRegisterLeader(value)
        logger.info('Nærmeste leder registrert successfully')
      } catch (e) {
        logger.error(`Feil ved innsending av kartleggingssporsmal: ${e}`)
        setSubmitError(true)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="space-y-6">
      <Heading size="large" level="1">
        Oppgi nærmeste leder
      </Heading>

      {prefillError && (
        <Alert variant="error" role="alert">
          Kunne ikke forhåndsvise sykmeldt-data: {prefillError}
        </Alert>
      )}

      {submitError && (
        <Alert className="mb-8 w-2xl" variant="error" role="alert">
          <Heading size="small" level="2">
            Beklager! Det har oppstått en uventet feil
          </Heading>
          Vi klarte ikke å sende inn nærmeste leder. Prøv igjen om litt.
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="mt-8"
      >
        <form.AppForm>
          <div className="grid gap-4 mb-4">
            <Fieldset legend="Sykmeldt" className="space-y-4">
              <form.AppField name="sykmeldt.navn">{(field) => <field.TextInputField label="Navn" />}</form.AppField>
              <form.AppField name="sykmeldt.fodselsnummer">
                {(field) => <field.TextInputField label="Fødselsnummer (11 sifre)" />}
              </form.AppField>
            </Fieldset>
          </div>
          <div className="grid gap-4 mb-4">
            <Fieldset legend="Nærmeste leder" className="space-y-4">
              <form.AppField name="leder.fodselsnummer">
                {(field) => <field.TextInputField label="Fødselsnummer (11 sifre)" />}
              </form.AppField>
              <form.AppField name="leder.fornavn">{(field) => <field.TextInputField label="Fornavn" />}</form.AppField>
              <form.AppField name="leder.etternavn">
                {(field) => <field.TextInputField label="Etternavn" />}
              </form.AppField>
              <form.AppField name="leder.mobilnummer">
                {(field) => <field.TextInputField label="Mobilnummer" />}
              </form.AppField>
              <form.AppField name="leder.epost">
                {(field) => <field.TextInputField label="E-postadresse" />}
              </form.AppField>
            </Fieldset>
          </div>
        </form.AppForm>
        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={submitting} onClick={() => form.handleSubmit()}>
            {submitting ? 'Sender…' : 'Send svarene til Nav'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => form.reset()}>
            Nullstill
          </Button>
        </div>
      </form>
    </div>
  )
}
