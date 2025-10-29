'use client'

import { useState } from 'react'
import { revalidateLogic } from '@tanstack/react-form'
import { Button, Fieldset, Heading } from '@navikt/ds-react'
import { useAppForm } from '@/components/form/hooks/form'
import { logger } from '@navikt/next-logger'
import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
  narmesteLederInfoSchema,
} from '@/schemas/nærmestelederFormSchema'
import { AlertErrorNarmesteLeder } from '@/components/AlertErrorNarmesteLeder'

// --- API ---
const clientPostRegisterLeader = async (body: NarmesteLederInfo): Promise<string> => {
  // TODO mapping and sending to backend
  return 'done'
}
export default function RegisterNarmestelederForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const form = useAppForm({
    defaultValues: narmesteLederInfoDefaults,
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),

    validators: { onSubmit: narmesteLederInfoSchema },
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
      <Heading size="large" level="1" spacing>
        Oppgi nærmeste leder
      </Heading>

      {submitError && <AlertErrorNarmesteLeder />}

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
              <form.AppField name="sykmeldt.fodselsnummer">
                {(field) => <field.TextInputField label="Fødselsnummer (11 sifre)" />}
              </form.AppField>
              <form.AppField name="sykmeldt.orgnummer">
                {(field) => <field.TextInputField label="Orgnummer" />}
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
