import { BodyShort, Box, Heading, Label, VStack } from '@navikt/ds-react'

type SykmeldtProps = {
  fodselsnummer: string
  navn: string
}

export default function SykmeldtBox({ fodselsnummer, navn }: SykmeldtProps) {
  return (
    <Box padding="space-16" background="surface-info-subtle" borderRadius="large">
      <VStack gap="4">
        <Heading level="2" size="small">
          Sykmeldt
        </Heading>

        <VStack gap="2">
          <div>
            <Label size="small">Navn</Label>
            <BodyShort>{navn}</BodyShort>
          </div>

          <div>
            <Label size="small">Fødselsnummer</Label>
            <BodyShort>{fodselsnummer}</BodyShort>
          </div>
        </VStack>
      </VStack>
    </Box>
  )
}
