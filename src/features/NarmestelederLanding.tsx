'use client'

import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { useState } from 'react'

export type NarmestelederLandingProps = {
  backendPostResult: string
}

export default function NarmestelederLanding({ backendPostResult }: NarmestelederLandingProps) {
  const [infoHidden, setInfoHidden] = useState(false)

  const handleClick = async () => {
    console.log('Button clicked!')
    setInfoHidden(!infoHidden)
  }

  return (
    <VStack gap="space-12">
      <Heading size={'large'} level="1" spacing>
        Angi nærmeste leder
      </Heading>
      <BodyShort spacing>
        <Button onClick={handleClick} icon={<ThumbUpIcon title="a11y tittel" />} size={'medium'} variant="primary">
          Hide info
        </Button>
        <VStack>
          <Alert hidden={infoHidden} variant={'info'}>
            Backend post result: {backendPostResult}
          </Alert>
        </VStack>
      </BodyShort>
    </VStack>
  )
}
