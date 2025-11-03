'use client'

import { revalidateLogic } from '@tanstack/react-form'
import { useAppForm } from '@/components/form/hooks/form'
import { lederOnlyDefaults, lederOnlySchema } from '@/schemas/nærmestelederFormSchema'
import { LederGroup } from '@/components/form/LederGroup'
import { oppdaterNarmesteLeder } from '@/server/actions/oppdaterNarmesteLeder'
import ThankYouAlert from '@/components/form/ThankYouAlert'
import { HStack, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import ErrorAlert from '@/components/form/ErrorAlert'

type props = {
  behovId: string
}

export default function AngiNarmesteLederForSykmeldt({ behovId }: props) {
  const [actionError, setActionError] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const form = useAppForm({
    defaultValues: lederOnlyDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: lederOnlySchema },
    onSubmit: async ({ value }) => {
      const actionResult = await oppdaterNarmesteLeder(behovId, value.leder)
      if (!actionResult.success) {
        setActionError(true)
        return
      }
      setShowThankYou(true)
    },
  })

  if (showThankYou) {
    return <ThankYouAlert />
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
    >
      <VStack gap="4">
        <form.AppForm>
          <VStack gap="4">
            <LederGroup form={form} fields="leder" />
          </VStack>
        </form.AppForm>
        {actionError && <ErrorAlert />}
        <HStack className="mt-0">
          <form.AppForm>
            <form.BoundSubmitButton label="Lagre nærmeste leder" />
          </form.AppForm>
        </HStack>
      </VStack>
    </form>
  )
}
