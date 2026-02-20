import { HStack, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/shared/components/ExitButton";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import { InfoDescription } from "@/shared/components/InfoDescription";
import { Lumi } from "@/shared/components/lumi/Lumi";
import { lumiSurveyConfig } from "@/shared/components/lumi/lumiSurveyConfig";
import ThankYouAlert from "@/shared/components/ThankYouAlert";
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
      <Lumi
        feedbackId="sykmeldt-and-leder-feedback"
        survey={lumiSurveyConfig}
      />
    </>
  );
}
