import { HStack, VStack } from "@navikt/ds-react";
import { LederInfoDescription } from "@/app/(behov)/[behovId]/components/LederInfoDescription";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { Lumi } from "@/components/lumi/Lumi";
import { lumiSurvey } from "@/components/lumi/lumiSurvey";
import ThankYouAlert from "@/components/ThankYouAlert";
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
