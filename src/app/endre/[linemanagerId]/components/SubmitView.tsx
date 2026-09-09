"use client";

import { Button, HStack, VStack } from "@navikt/ds-react";
import { getSafeReturnTo } from "@/app/(registrering)/utils/returnTo";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import ThankYouAlert from "@/shared/components/ThankYouAlert";

export function SubmitView({ returnTo }: { returnTo?: string }) {
  const returnToUrl = getSafeReturnTo(returnTo);

  return (
    <VStack gap="space-24">
      <HeadingLeder readOnlyVirksomhet tittel="Bytt nærmeste leder" />
      <ThankYouAlert />
      {returnToUrl ? (
        <HStack>
          <Button as="a" href={returnToUrl} variant="secondary" size="small">
            Tilbake til oversikt
          </Button>
        </HStack>
      ) : null}
    </VStack>
  );
}
