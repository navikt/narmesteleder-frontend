import { Button, Heading, VStack } from '@navikt/ds-react'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { PageBlock } from '@navikt/ds-react/Page'

export default function Home() {
  return (
    <VStack gap="space-12">
      <Heading size={'large'} level="1" spacing>
        Oppdater nærmeste leder
      </Heading>
      <PageBlock width="md" gutters>
        <Button icon={<ThumbUpIcon title="a11y tittel" />} variant="primary">
          Gjør noe!
        </Button>
      </PageBlock>
    </VStack>
  )
}
