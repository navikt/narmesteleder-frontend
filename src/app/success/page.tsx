import ThankYouAlert from '@/components/form/ThankYouAlert'
import { publicEnv } from '@/env-variables/publicEnv'
import { Button } from '@navikt/ds-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ThankYouAlert />
      
      <div className="mt-6">
        <Button as={Link} href={publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL} variant="secondary">
          Min side arbeidsgiver
        </Button>
      </div>
    </div>
  )
}