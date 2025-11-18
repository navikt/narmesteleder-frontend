import {
  BodyShort,
  Box,
  Heading,
  Label,
  Stack,
  VStack,
} from "@navikt/ds-react";
import { useLederOnlyContextState } from "@/context/lederOnlyContextState";

export default function SykmeldtBox() {
  const { lederInfo } = useLederOnlyContextState();
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
            <BodyShort style={{ minWidth: "8rem" }}>
              {lederInfo.sykmeldt.fullnavn}
            </BodyShort>
            <BodyShort style={{ minWidth: "8rem" }}>
              {lederInfo.sykmeldtFnr}
            </BodyShort>
          </Stack>
        </Stack>
      </VStack>
    </Box>
  );
}
