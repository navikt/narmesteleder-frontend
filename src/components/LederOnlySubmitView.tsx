import { HStack, Page, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import { LederOnlySummary } from "@/components/LederOnlySummary";
import ThankYouAlert from "@/components/ThankYouAlert";

export function LederOnlySubmitView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <ThankYouAlert />
        <LederInfoDescription />
        <LederOnlySummary />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
    </Page>
  );
}
