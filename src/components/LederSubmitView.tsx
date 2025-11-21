import { HStack, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import { LederSummary } from "@/components/LederSummary";
import ThankYouAlert from "@/components/ThankYouAlert";

export function LederSubmitView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <ThankYouAlert />
      <LederInfoDescription />
      <LederSummary />
      <HStack>
        <ExitButton />
      </HStack>
    </VStack>
  );
}
