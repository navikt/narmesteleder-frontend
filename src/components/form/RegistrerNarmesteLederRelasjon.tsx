'use client'

import { revalidateLogic } from '@tanstack/react-form'
import { Heading, VStack } from '@navikt/ds-react'
import { useAppForm } from '@/components/form/hooks/form'
import { narmesteLederInfoDefaults, narmesteLederInfoSchema } from '@/schemas/nærmestelederFormSchema'
import { SykmeldtGroup } from '@/components/form/SykmeldtGroup'
import { opprettNaresteLeder } from '@/server/actions/opprettNarmesteLeder'
import ThankYouAlert from '@/components/form/ThankYouAlert'
import { LederGroup } from '@/components/form/LederGroup'

export default function RegistrerNarmesteLederRelasjon() {
  const form = useAppForm({
    defaultValues: narmesteLederInfoDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: narmesteLederInfoSchema },
    onSubmit: async ({ value }) => {
      await opprettNaresteLeder(value)
      return ThankYouAlert()
    },
  })

  return (
    <VStack gap="6">
      <Heading size="large" level="1">
        Registrer nærmeste leder
      </Heading>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          await form.handleSubmit()
        }}
      >
        <form.AppForm>
          <VStack gap="16">
            <VStack gap="4">
              <Heading size="medium" level="2">
                Sykmeldt
              </Heading>
              <SykmeldtGroup form={form} fields="sykmeldt" />
            </VStack>

            <VStack gap="4">
              <Heading size="medium" level="2">
                Nærmeste leder
              </Heading>
              <LederGroup form={form} fields="leder" />
            </VStack>

            <form.BoundSubmitButton label="Lagre nærmeste leder" />
          </VStack>
        </form.AppForm>
      </form>
    </VStack>
  )
}
