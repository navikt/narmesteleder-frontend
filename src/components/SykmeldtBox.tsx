import {
  BodyShort,
  BoxNew,
  Heading,
  Label,
  Stack,
  VStack,
} from "@navikt/ds-react";
import { useLederContextState } from "@/context/lederContextState";
import { TestId } from "@/utils/testIds";

export default function SykmeldtBox() {
  const { lederInfo } = useLederContextState();
  return (
    <BoxNew
      padding="space-16"
      background="accent-soft"
      borderRadius="8"
      data-testid={TestId.SykmeldtBox}
    >
      <VStack gap="space-16">
        <Heading level="2" size="small">
          Sykmeldt
        </Heading>
        <Stack
          direction="row"
          gap={{
            xs: "space-12",
            sm: "space-32",
            md: "space-64",
            lg: "space-128",
          }}
        >
          <Stack direction="column" gap="space-16">
            <Label size="small" className="min-w-32">
              Navn
            </Label>
            <BodyShort className="min-w-32">
              {lederInfo.sykmeldt.fullnavn}
            </BodyShort>
          </Stack>
          <Stack direction="column" gap="space-16">
            <Label size="small" className="min-w-32">
              Fødselsnummer
            </Label>
            <BodyShort className="min-w-32">{lederInfo.sykmeldtFnr}</BodyShort>
          </Stack>
        </Stack>
      </VStack>
    </BoxNew>
  );
}
