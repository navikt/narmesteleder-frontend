import { HStack, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { Lumi } from "@/components/lumi/Lumi";
import { lumiSurvey } from "@/components/lumi/lumiSurvey";
import ThankYouAlert from "@/components/ThankYouAlert";
import { LederInfoDescription } from "./LederInfoDescription";
import { LederSummary } from "./LederSummary";

export function LederSubmitView() {
  return (
    <>
      <VStack gap="space-32">
        <HeadingLeder />
        <ThankYouAlert />
        <LederInfoDescription />
        <LederSummary />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
      <Lumi feedbackId="leder-feedback" survey={lumiSurvey} />
    </>
  );
}
