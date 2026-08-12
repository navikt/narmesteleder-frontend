import { Button, HStack, VStack } from "@navikt/ds-react";
import Link from "next/link";
import { useRegistreringContextState } from "@/app/(registrering)/state/contextState";
import { getSafeReturnTo } from "@/app/(registrering)/utils/returnTo";
import { ExitButton } from "@/shared/components/ExitButton";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import { InfoDescription } from "@/shared/components/InfoDescription";
import { Lumi } from "@/shared/components/lumi/Lumi";
import { lumiSurveyConfig } from "@/shared/components/lumi/lumiSurveyConfig";
import ThankYouAlert from "@/shared/components/ThankYouAlert";
import { Summary } from "./Summary";

export function SubmitView() {
  const { returnTo } = useRegistreringContextState();
  const returnToUrl = getSafeReturnTo(returnTo);

  return (
    <>
      <VStack gap="space-24">
        <HeadingLeder readOnlyVirksomhet />
        <ThankYouAlert />
        <InfoDescription />
        <Summary />
        <HStack gap="space-12">
          {returnToUrl && (
            <Button
              as={Link}
              href={returnToUrl}
              variant="secondary"
              size="small"
            >
              Tilbake til oversikt
            </Button>
          )}
          <ExitButton />
        </HStack>
      </VStack>
      <Lumi
        feedbackId="sykmeldt-and-leder-feedback"
        survey={lumiSurveyConfig}
      />
    </>
  );
}
