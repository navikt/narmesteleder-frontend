import ThankYouAlert from '@/components/form/ThankYouAlert'
import { publicEnv } from '@/env-variables/publicEnv'
import { Button, HStack, VStack } from '@navikt/ds-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <VStack gap="6">
      <ThankYouAlert />
      <HStack className="mt-0">
        <Button as={Link} href={publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL} variant="secondary">
          Min side arbeidsgiver
        </Button>
      </HStack>
    </VStack>
  )
}
