import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { ButtonMinSideArbeidsgiver } from "@/shared/components/ButtonMinSideArbeidsgiver";

const NotFound = async () => (
  <PageBlock as="main" width="xl" gutters>
    <Box paddingBlock="space-80 space-64" data-aksel-template="404-v2">
      <VStack gap="space-64">
        <VStack gap="space-24" align="start">
          <div>
            <Heading level="1" size="large" spacing>
              Beklager, vi fant ikke siden
            </Heading>
            <BodyShort>
              Denne siden kan være slettet eller flyttet, eller det er en feil i
              lenken.
            </BodyShort>
          </div>
          <ButtonMinSideArbeidsgiver />
        </VStack>

        <VStack gap="space-24" align="start">
          <Heading level="2" size="large">
            Page not found
          </Heading>
          <BodyShort spacing>The page you requested cannot be found.</BodyShort>
          <ButtonMinSideArbeidsgiver text="Go to employer page" />
        </VStack>
      </VStack>
    </Box>
  </PageBlock>
);

export default NotFound;
