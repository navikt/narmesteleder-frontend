'use client'

import { revalidateLogic } from '@tanstack/react-form'
import { useAppForm } from '@/components/form/hooks/form'
import { lederOnlyDefaults, lederOnlySchema } from '@/schemas/nærmestelederFormSchema'
import { LederGroup } from '@/components/form/LederGroup'
import { oppdaterNarmesteLeder } from '@/server/actions/oppdaterNarmesteLeder'
import ThankYouAlert from '@/components/form/ThankYouAlert'
import { HStack, VStack } from '@navikt/ds-react'

type props = {
  behovId: string
}

export default function AngiNarmesteLederForSykmeldt({ behovId }: props) {
  const form = useAppForm({
    defaultValues: lederOnlyDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: lederOnlySchema },
    onSubmit: async ({ value }) => {
      await oppdaterNarmesteLeder(behovId, value.leder)
      return ThankYouAlert()
    },
  })

  return (
    <VStack gap="6">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          await form.handleSubmit()
        }}
      >
        <form.AppForm>
          <VStack gap="4">
            <LederGroup form={form} fields="leder" />
          </VStack>
        </form.AppForm>

        <HStack gap="3" className="mt-8">
          <form.AppForm>
            <form.BoundSubmitButton label="Lagre nærmeste leder" />
          </form.AppForm>
        </HStack>
      </form>
    </VStack>
  )
}
