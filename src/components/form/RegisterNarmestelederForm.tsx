'use client'

import { revalidateLogic } from '@tanstack/react-form'
import { Heading } from '@navikt/ds-react'
import { useAppForm } from '@/components/form/hooks/form'
import { narmesteLederInfoDefaults, narmesteLederInfoSchema } from '@/schemas/nærmestelederFormSchema'
import { SykmeldtSubform } from '@/components/form/SykmeldtSubform'
import { NarmestelederSubform } from '@/components/form/NarmestelederSubform'

export default function RegisterNarmestelederForm() {
  const form = useAppForm({
    defaultValues: narmesteLederInfoDefaults,
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),

    validators: { onSubmit: narmesteLederInfoSchema },
    onSubmit: async ({ value }) => {
      console.log(value)
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <div className="space-y-6">
      <Heading size="large" level="1" spacing>
        Oppgi nærmeste leder
      </Heading>

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
            <SykmeldtSubform form={form} />
          </div>

          <div className="grid gap-4 mb-4">
            <NarmestelederSubform form={form} />
          </div>
        </form.AppForm>
        <div className="flex gap-3">
          <form.AppForm>
            <form.BoundSubmitButton label="Lagre nærmeste leder" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}
