import {BodyShort, Button, Heading, VStack } from '@navikt/ds-react'
import { ThumbUpIcon } from '@navikt/aksel-icons'

export default function Home() {
  return (
    <VStack gap="space-12">
      <Heading size={'large'} level="1" spacing>
        Oppdater nærmeste leder
      </Heading>
      <BodyShort spacing>
        <Button icon={<ThumbUpIcon title="a11y tittel" />} size={"medium"} variant="primary">
          Gjør noe!
        </Button>
      </BodyShort>
    </VStack>
  )
}
