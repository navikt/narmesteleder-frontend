"use client";

import { Button, HStack, VStack } from "@navikt/ds-react";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import ThankYouAlert from "@/shared/components/ThankYouAlert";
import { getSafeReturnTo } from "@/utils/returnTo";

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
