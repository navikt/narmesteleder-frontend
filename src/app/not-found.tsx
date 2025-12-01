import { BugIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  BoxNew,
  Button,
  Heading,
  Link,
  List,
  VStack,
} from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { PageBlock } from "@navikt/ds-react/Page";
import { publicEnv } from "@/env-variables/publicEnv";

const NotFound = async () => (
  <PageBlock as="main" width="xl" gutters>
    <BoxNew paddingBlock="space-80 space-64" data-aksel-template="404-v2">
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
          <Button
            as="a"
            href={publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL}
            variant="primary"
          >
            Gå til Min side arbeidsgiver
          </Button>
        </VStack>

        <VStack gap="space-24" align="start">
          <Heading level="2" size="large">
            Page not found
          </Heading>
          <BodyShort spacing>The page you requested cannot be found.</BodyShort>
          <Button
            as="a"
            href={publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL}
            variant="primary"
          >
            Go to page Min side arbeidsgiver
          </Button>
        </VStack>
      </VStack>
    </BoxNew>
  </PageBlock>
);

export default NotFound;
