'use client'

import { useState } from 'react'
import { revalidateLogic } from '@tanstack/react-form'
import { z } from 'zod'
import { Alert, Button, Fieldset, Heading, TextField } from '@navikt/ds-react'
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
        <Fieldset legend="Sykmeldt" className="space-y-4">
          {/* sykmeldt.navn */}
          <form.Field
            name="sykmeldt.navn"
            // Per-field validation while typing:
            validators={{ onChange: registerSchema.shape.sykmeldt.shape.navn }}
          >
            {(field) => (
              <TextField
                label="Navn"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          {/* sykmeldt.fodselsnummer */}
          <form.Field
            name="sykmeldt.fodselsnummer"
            validators={{ onChange: registerSchema.shape.sykmeldt.shape.fodselsnummer }}
          >
            {(field) => (
              <TextField
                label="Fødselsnummer (11 sifre)"
                inputMode="numeric"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>
        </Fieldset>

        <Fieldset legend="Leder" className="space-y-4">
          {/* leder.fodselsnummer */}
          <form.Field
            name="leder.fodselsnummer"
            validators={{ onChange: registerSchema.shape.leder.shape.fodselsnummer }}
          >
            {(field) => (
              <TextField
                label="Fødselsnummer (11 sifre)"
                inputMode="numeric"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          {/* leder.fornavn */}
          <form.Field name="leder.fornavn" validators={{ onChange: registerSchema.shape.leder.shape.fornavn }}>
            {(field) => (
              <TextField
                label="Fornavn"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          {/* leder.etternavn */}
          <form.Field name="leder.etternavn" validators={{ onChange: registerSchema.shape.leder.shape.etternavn }}>
            {(field) => (
              <TextField
                label="Etternavn"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          {/* leder.mobilnummer */}
          <form.Field name="leder.mobilnummer" validators={{ onChange: registerSchema.shape.leder.shape.mobilnummer }}>
            {(field) => (
              <TextField
                label="Mobilnummer (8 sifre)"
                inputMode="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          {/* leder.epost */}
          <form.Field name="leder.epost" validators={{ onChange: registerSchema.shape.leder.shape.epost }}>
            {(field) => (
              <TextField
                label="E-postadresse"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>
        </Fieldset>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting} variant="primary" disabled={submitting}>
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
