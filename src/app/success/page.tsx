import ThankYouAlert from '@/components/form/ThankYouAlert'
import { Button } from '@navikt/ds-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ThankYouAlert />
      
      <div className="mt-6">
        <Button as={Link} href="/" variant="secondary">
          Tilbake til forsiden
        </Button>
      </div>
    </div>
  )
}