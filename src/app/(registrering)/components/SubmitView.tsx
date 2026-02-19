import { HStack, VStack } from "@navikt/ds-react";
import { InfoDescription } from "@/app/(behov)/[behovId]/components/InfoDescription";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { Lumi } from "@/components/lumi/Lumi";
import { lumiSurvey } from "@/components/lumi/lumiSurvey";
import ThankYouAlert from "@/components/ThankYouAlert";
import { Summary } from "./Summary";

export function SubmitView() {
  return (
    <>
      <VStack gap="space-24">
        <HeadingLeder />
        <ThankYouAlert />
        <InfoDescription />
        <Summary />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
      <Lumi feedbackId="sykmeldt-and-leder-feedback" survey={lumiSurvey} />
    </>
  );
}
