import { HStack, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import ThankYouAlert from "@/components/ThankYouAlert";
import { Lumi } from "./lumi/Lumi";
import { lumiSurvey } from "./lumi/lumiSurvey";
import { SykmeldtAndLederSummary } from "./SykmeldtAndLederSummary";

export function SykmeldtAndLederSubmitView() {
  return (
    <>
      <VStack gap="space-24">
        <HeadingLeder />
        <ThankYouAlert />
        <LederInfoDescription />
        <SykmeldtAndLederSummary />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
      <Lumi feedbackId="sykmeldt-and-leder-feedback" survey={lumiSurvey} />
    </>
  );
}
