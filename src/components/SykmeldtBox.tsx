import {
  BodyShort,
  BoxNew,
  Heading,
  Label,
  Stack,
  VStack,
} from "@navikt/ds-react";
import { useLederContextState } from "@/context/lederContextState";

export default function SykmeldtBox() {
  const { lederInfo } = useLederContextState();
  return (
    <BoxNew padding="space-16" background="accent-soft" borderRadius="8">
      <VStack gap="space-16">
        <Heading level="2" size="small">
          Sykmeldt
        </Heading>
        <Stack direction="column" gap="space-16">
          <Stack direction="row" gap="space-128">
            <Label size="small" className="min-w-32">
              Navn
            </Label>
            <Label size="small" className="min-w-32">
              Fødselsnummer
            </Label>
          </Stack>
          <Stack direction="row" gap="space-128">
            <BodyShort className="min-w-32">
              {lederInfo.sykmeldt.fullnavn}
            </BodyShort>
            <BodyShort className="min-w-32">{lederInfo.sykmeldtFnr}</BodyShort>
          </Stack>
        </Stack>
      </VStack>
    </BoxNew>
  );
}
