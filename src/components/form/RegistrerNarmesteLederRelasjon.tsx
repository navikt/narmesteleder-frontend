'use client'

import { revalidateLogic } from '@tanstack/react-form'
import { Heading, VStack } from '@navikt/ds-react'
import { useAppForm } from '@/components/form/hooks/form'
import { narmesteLederInfoDefaults, narmesteLederInfoSchema } from '@/schemas/nærmestelederFormSchema'
import { SykmeldtGroup } from '@/components/form/SykmeldtGroup'
import { opprettNaresteLeder } from '@/server/actions/opprettNarmesteLeder'
import { useState } from 'react'
import { AlertError } from '@/components/AlertError'
import ThankYouAlert from '@/components/form/ThankYouAlert'
import { LederGroup } from '@/components/form/LederGroup'

export default function RegistrerNarmesteLederRelasjon() {
  const [submitError, setSubmitError] = useState(false)
  const form = useAppForm({
    defaultValues: narmesteLederInfoDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: narmesteLederInfoSchema },
    onSubmit: async ({ value }) => {
      try {
        await opprettNaresteLeder(value)
        return ThankYouAlert()
      } catch {
        setSubmitError(true)
      }
    },
  })

  return (
    <div className="space-y-6">
      <Heading size="large" level="1" spacing>
        Registrer nærmeste leder
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
          <VStack gap="space-16">
            <div className="grid gap-4 mb-4">
              <Heading size="medium">Sykmeldt</Heading>
              <SykmeldtGroup form={form} fields="sykmeldt" />
            </div>

            <div className="grid gap-4 mb-4">
              <Heading size="medium">Nærmeste leder</Heading>
              <LederGroup form={form} fields="leder" />
            </div>
          </VStack>
        </form.AppForm>
        {submitError && <AlertError />}
        <form.AppForm>
          <form.BoundSubmitButton label="Lagre nærmeste leder" />
        </form.AppForm>
      </form>
    </div>
  )
}
