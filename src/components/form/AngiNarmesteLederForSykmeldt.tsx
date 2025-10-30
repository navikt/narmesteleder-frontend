'use client'

import { revalidateLogic } from '@tanstack/react-form'
import { useAppForm } from '@/components/form/hooks/form'
import { lederOnlyDefaults, lederOnlySchema } from '@/schemas/nærmestelederFormSchema'
import { NarmestelederSubform } from '@/components/form/NarmestelederSubform'
import { useState } from 'react'
import { AlertError } from '@/components/AlertError'
import { oppdaterNarmesteLeder } from '@/server/actions/oppdaterNarmesteLeder'
import ThankYouAlert from '@/components/form/ThankYouAlert'

type props = {
  behovId: string
}

export default function AngiNarmesteLederForSykmeldt({ behovId }: props) {
  const [submitError, setSubmitError] = useState(false)
  const form = useAppForm({
    defaultValues: lederOnlyDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: lederOnlySchema },
    onSubmit: async ({ value }) => {
      try {
        await oppdaterNarmesteLeder(behovId, value.leder)
        return ThankYouAlert()
      } catch {
        setSubmitError(true)
      }
    },
  })

  return (
    <div className="space-y-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          await form.handleSubmit()
        }}
        className="mt-8"
      >
        <form.AppForm>
          <div className="grid gap-4 mb-4">
            <NarmestelederSubform form={form} />
          </div>
        </form.AppForm>
        {submitError && <AlertError />}
        <div className="flex gap-3">
          <form.AppForm>
            <form.BoundSubmitButton label="Lagre nærmeste leder" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}
