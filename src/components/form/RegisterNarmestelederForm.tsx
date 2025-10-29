'use client'

import { useState } from 'react'
import { revalidateLogic } from '@tanstack/react-form'
import { Button, Heading } from '@navikt/ds-react'
import { useAppForm } from '@/components/form/hooks/form'
import { logger } from '@navikt/next-logger'
import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
  narmesteLederInfoSchema,
} from '@/schemas/nærmestelederFormSchema'
import { SykmeldtSubform } from '@/components/form/SykmeldtSubform'
import { NarmestelederSubform } from '@/components/form/NarmestelederSubform'

// --- API ---
const clientPostRegisterLeader = async (body: NarmesteLederInfo): Promise<string> => {
  // TODO mapping and sending to backend
  return 'done'
}
export default function RegisterNarmestelederForm() {
  const [submitting, setSubmitting] = useState(false)

  const form = useAppForm({
    defaultValues: narmesteLederInfoDefaults,
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),

    validators: { onSubmit: narmesteLederInfoSchema },
    onSubmit: async ({ value }) => {
      try {
        setSubmitting(true)
        await clientPostRegisterLeader(value)
        logger.info('Nærmeste leder registrert successfully')
      } catch (e) {
        logger.error(`Feil ved innsending av kartleggingssporsmal: ${e}`)
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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="mt-8"
      >
        <form.AppForm>
          <div className="grid gap-4 mb-4">
            <SykmeldtSubform form={form} />
          </div>

          <div className="grid gap-4 mb-4">
            <NarmestelederSubform form={form} />
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
