import { HStack, Page, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import ThankYouAlert from "@/components/ThankYouAlert";
import { SykmeldtAndLederSummary } from "./SykmeldtAndLederSummary";

export function SykmeldtAndLederSubmitView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="space-32">
        <ThankYouAlert />
        <LederInfoDescription />
        <SykmeldtAndLederSummary />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
    </Page>
  );
}
