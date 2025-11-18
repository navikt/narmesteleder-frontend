import { HStack, Page, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import ThankYouAlert from "@/components/ThankYouAlert";
import { SykmeldtLederSummary } from "./SykmeldtLederSummary";

export function SykmeldtLederSubmitView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <ThankYouAlert />
        <LederInfoDescription />
        <SykmeldtLederSummary />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
    </Page>
  );
}
