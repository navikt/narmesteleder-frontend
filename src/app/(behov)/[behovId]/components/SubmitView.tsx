import { Button, HStack, VStack } from "@navikt/ds-react";
import { useBehovContextState } from "@/app/(behov)/[behovId]/state/contextState";
import { getSafeReturnTo } from "@/app/(registrering)/utils/returnTo";
import { ExitButton } from "@/shared/components/ExitButton";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import { InfoDescription } from "@/shared/components/InfoDescription";
import ThankYouAlert from "@/shared/components/ThankYouAlert";
import { Summary } from "./Summary";

export function SubmitView() {
  const { returnTo } = useBehovContextState();
  const returnToUrl = getSafeReturnTo(returnTo);

  return (
    <VStack gap="space-32">
      <HeadingLeder readOnlyVirksomhet />
      <ThankYouAlert />
      <InfoDescription />
      <Summary />
      <HStack gap="space-12">
        {returnToUrl && (
          <Button as="a" href={returnToUrl} variant="secondary" size="small">
            Tilbake til oversikt
          </Button>
        )}
        <ExitButton />
      </HStack>
    </VStack>
  );
}
