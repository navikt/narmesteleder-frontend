'use client'

import { revalidateLogic } from '@tanstack/react-form'
import { Heading, HStack, VStack } from '@navikt/ds-react'
import { useAppForm } from '@/components/form/hooks/form'
import { narmesteLederInfoDefaults, narmesteLederInfoSchema } from '@/schemas/nærmestelederFormSchema'
import { SykmeldtGroup } from '@/components/form/SykmeldtGroup'
import { opprettNarmesteLeder } from '@/server/actions/opprettNarmesteLeder'
import ThankYouAlert from '@/components/form/ThankYouAlert'
import { LederGroup } from '@/components/form/LederGroup'
import { useState } from 'react'
import ErrorAlert from '@/components/form/ErrorAlert'

export default function RegistrerNarmesteLederRelasjon() {
  const [actionError, setActionError] = useState(false)

  const form = useAppForm({
    defaultValues: narmesteLederInfoDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: narmesteLederInfoSchema },
    onSubmit: async ({ value }) => {
      const actionResult = await opprettNarmesteLeder(value)
      if (!actionResult.success) {
        setActionError(true)
      }
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
          <VStack gap="6">
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
            {actionError && <ErrorAlert />}
            <HStack className="mt-0">
              <form.BoundSubmitButton label="Send inn" />
            </HStack>
          </VStack>
        </form.AppForm>
      </form>
    </VStack>
  )
}
