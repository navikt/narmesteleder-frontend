import React from "react";
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

const NotFound = async () => (
  <PageBlock as="main" width="xl" gutters>
    <BoxNew paddingBlock="space-80 space-64" data-aksel-template="404-v2">
      <VStack gap="space-64">
        <VStack gap="space-48" align="start">
          <div>
            <Heading level="1" size="large" spacing>
              Beklager, vi fant ikke siden
            </Heading>
            <BodyShort>
              Denne siden kan være slettet eller flyttet, eller det er en feil i
              lenken.
            </BodyShort>
            <List>
              <ListItem>Bruk gjerne søket eller menyen</ListItem>
              <ListItem>
                <Link href="#">Gå til forsiden</Link>
              </ListItem>
            </List>
          </div>
          <Button as="a" href="#">
            Gå til Min side
          </Button>
          <Link href="#">
            <BugIcon aria-hidden />
            Meld gjerne fra om at lenken ikke virker
          </Link>
        </VStack>

        <div>
          <Heading level="2" size="large" spacing>
            Page not found
          </Heading>
          <BodyShort spacing>The page you requested cannot be found.</BodyShort>
          <BodyShort>
            Go to the <Link href="#">front page</Link>, or use one of the links
            in the menu.
          </BodyShort>
        </div>
      </VStack>
    </BoxNew>
  </PageBlock>
);

export default NotFound;
