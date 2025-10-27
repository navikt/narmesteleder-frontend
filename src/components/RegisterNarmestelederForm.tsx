'use client'

import { useState, useTransition } from 'react'
import { useForm } from '@tanstack/react-form'
import { Alert, Button, Fieldset, Heading, TextField } from '@navikt/ds-react'
import { RegisterRequest, SykmeldtPost } from '@/services/narmesteleder/schemas/formSchema'

const clientPostRegisterLeader = async (body: RegisterRequest): Promise<string> => {
  // TODO mapping and sending to backend
  return 'done'
}

export type RegisterNarmestelederFormProps = {
  initialSykmeldt?: SykmeldtPost
  prefillError?: string
}

export default function RegisterNarmestelederForm({ initialSykmeldt, prefillError }: RegisterNarmestelederFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const defaultValues = {
    sykmeldt: initialSykmeldt ?? { navn: '', fodselsnummer: '' },
    leder: { fodselsnummer: '', fornavn: '', etternavn: '', mobilnummer: '', epost: '' },
  } satisfies RegisterRequest

  const form = useForm({
    defaultValues,

    onSubmit: async ({ value }) => {
      setServerError(null)
      setSuccessMsg(null)
      startTransition(async () => {
        try {
          const id = await clientPostRegisterLeader(value)
          setSuccessMsg(`Registrert! Referanse: ${id}`)
        } catch (e) {
          setServerError(e instanceof Error ? e.message : 'Noe gikk galt.')
        }
      })
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

      {serverError && (
        <Alert variant="error" role="alert">
          {serverError}
        </Alert>
      )}

      {successMsg && (
        <Alert variant="success" role="status">
          {successMsg}
        </Alert>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await form.handleSubmit()
        }}
        className="space-y-8"
      >
        <Fieldset legend="Sykmeldt" className="space-y-4">
          <form.Field name="sykmeldt.navn">
            {(field) => (
              <TextField
                label="Navn"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
                required
              />
            )}
          </form.Field>

          <form.Field name="sykmeldt.fodselsnummer">
            {(field) => (
              <TextField
                label="Fødselsnummer"
                inputMode="numeric"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                error={field.state.meta.errors[0]}
                required
              />
            )}
          </form.Field>
        </Fieldset>

        <Fieldset legend="Leder" className="space-y-4">
          <form.Field name="leder.fodselsnummer">
            {(field) => (
              <TextField
                label="Fødselsnummer"
                inputMode="numeric"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                error={field.state.meta.errors[0]}
                required
              />
            )}
          </form.Field>

          <form.Field name="leder.fornavn">
            {(field) => (
              <TextField
                label="Fornavn"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
                required
              />
            )}
          </form.Field>

          <form.Field name="leder.etternavn">
            {(field) => (
              <TextField
                label="Etternavn"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
                required
              />
            )}
          </form.Field>

          <form.Field name="leder.mobilnummer">
            {(field) => (
              <TextField
                label="Mobilnummer"
                inputMode="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                error={field.state.meta.errors[0]}
                required
              />
            )}
          </form.Field>

          <form.Field name="leder.epost">
            {(field) => (
              <TextField
                label="E‑postadresse"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
                required
              />
            )}
          </form.Field>
        </Fieldset>

        <div className="flex gap-3">
          <Button type="submit" loading={isPending} variant="primary">
            Send inn
          </Button>
          <Button type="button" variant="secondary" onClick={() => form.reset()}>
            Nullstill
          </Button>
        </div>
      </form>
    </div>
  )
}
