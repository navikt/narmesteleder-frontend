import { BodyShort, Box, Heading, Label, VStack } from "@navikt/ds-react";
import { Stack } from "@navikt/ds-react";

type SykmeldtProps = {
  fodselsnummer: string;
  navn: string;
};

export default function SykmeldtBox({ fodselsnummer, navn }: SykmeldtProps) {
  return (
    <Box padding="space-16" background="surface-subtle" borderRadius="large">
      <VStack gap="4">
        <Heading level="2" size="small">
          Sykmeldt
        </Heading>
        <Stack direction="column" gap="4">
          <Stack direction="row" gap="32">
            <Label size="small" style={{ minWidth: "8rem" }}>
              Navn
            </Label>
            <Label size="small" style={{ minWidth: "8rem" }}>
              Fødselsnummer
            </Label>
          </Stack>
          <Stack direction="row" gap="32">
            <BodyShort style={{ minWidth: "8rem" }}>{navn}</BodyShort>
            <BodyShort style={{ minWidth: "8rem" }}>{fodselsnummer}</BodyShort>
          </Stack>
        </Stack>
      </VStack>
    </Box>
  );
}
