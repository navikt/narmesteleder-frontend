import { HStack, Page, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import { LederOnlySummary } from "@/components/LederOnlySummary";
import ThankYouAlert from "@/components/ThankYouAlert";
import { useLederOnlyFlow } from "@/context/LederOnlyFlowContext";

export function LederOnlySubmitView() {
  const { submittedData, handleEdit, lederInfo } = useLederOnlyFlow();
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <ThankYouAlert />
        <LederInfoDescription />
        <LederOnlySummary
          onEdit={handleEdit}
          lederFormData={submittedData}
          lederInfo={lederInfo}
        />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
    </Page>
  );
}
