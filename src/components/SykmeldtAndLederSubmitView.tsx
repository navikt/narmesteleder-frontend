import { HStack, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import ThankYouAlert from "@/components/ThankYouAlert";
import { SykmeldtAndLederSummary } from "./SykmeldtAndLederSummary";

export function SykmeldtAndLederSubmitView() {
  return (
    <VStack gap="space-24">
      <HeadingLeder />
      <ThankYouAlert />
      <LederInfoDescription />
      <SykmeldtAndLederSummary />
      <HStack>
        <ExitButton />
      </HStack>
    </VStack>
  );
}
