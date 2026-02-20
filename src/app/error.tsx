"use client";

import {
  BodyShort,
  Box,
  Heading,
  HGrid,
  Link,
  List,
  Page,
  VStack,
} from "@navikt/ds-react";
import { logger } from "@navikt/next-logger";
import { type ReactElement, useEffect } from "react";
import { ButtonMinSideArbeidsgiver } from "@/shared/components/ButtonMinSideArbeidsgiver";

const CONTACT_NAV_URL = "https://www.nav.no/kontaktoss#skriv-til-oss";

type Props = {
  error: Error;
};

export default function ErrorPage({ error }: Props): ReactElement {
  useEffect(() => {
    logger.error(`Displaying 500-page, errormessage: ${error.message}`);
  }, [error.message]);

  return (
    <Page.Block as="main" width="xl" gutters>
      <Box paddingBlock="space-80 space-32">
        <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
          <VStack gap="space-64">
            <VStack gap="space-48" align="start">
              <div>
                <BodyShort textColor="subtle" size="small">
                  Statuskode 500
                </BodyShort>
                <Heading level="1" size="large" spacing>
                  Beklager, noe gikk galt.
                </Heading>
                {/* Tekster bør tilpasses den aktuelle 500-feilen. Teksten under er for en generisk 500-feil. */}
                <BodyShort spacing>
                  En teknisk feil på våre servere gjør at siden er
                  utilgjengelig. Dette skyldes ikke noe du gjorde.
                </BodyShort>
                <BodyShort>Du kan prøve å</BodyShort>
                <List>
                  <List.Item>
                    vente noen minutter og{" "}
                    {/* Husk at POST-data går tapt når man reloader med JS. For å unngå dette kan dere
                          fjerne lenken (men beholde teksten) slik at man må bruke nettleserens reload-knapp. */}
                    <Link href="#" onClick={() => location.reload()}>
                      laste siden på nytt
                    </Link>
                  </List.Item>
                  <List.Item>
                    {/* Vurder å sjekke at window.history.length > 1 før dere rendrer dette som en lenke */}
                    <Link href="#" onClick={() => history.back()}>
                      gå tilbake til forrige side
                    </Link>
                  </List.Item>
                </List>
                <BodyShort>
                  Hvis problemet vedvarer, kan du{" "}
                  {/* https://nav.no/kontaktoss for eksterne flater */}
                  <Link href={CONTACT_NAV_URL} target="_blank">
                    kontakte oss (åpnes i ny fane)
                  </Link>
                  .
                </BodyShort>
              </div>

              <ButtonMinSideArbeidsgiver />
            </VStack>

            <div>
              <Heading level="1" size="large" spacing>
                Something went wrong
              </Heading>
              <BodyShort spacing>
                This was caused by a technical fault on our servers. Please
                refresh this page or try again in a few minutes.{" "}
              </BodyShort>
              <BodyShort>
                {/* https://www.nav.no/kontaktoss/en for eksterne flater */}
                <Link target="_blank" href={CONTACT_NAV_URL}>
                  Contact us (opens in new tab)
                </Link>{" "}
                if the problem persists.
              </BodyShort>
            </div>
          </VStack>
        </HGrid>
      </Box>
    </Page.Block>
  );
}
