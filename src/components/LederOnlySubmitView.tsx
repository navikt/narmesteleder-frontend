import { HStack, Page, VStack } from "@navikt/ds-react";
import { ExitButton } from "@/components/ExitButton";
import { HeadingLeder } from "@/components/HeadingLeder";
import { LederInfoDescription } from "@/components/LederInfoDescription";
import { LederOnlySummary } from "@/components/LederOnlySummary";
import ThankYouAlert from "@/components/ThankYouAlert";
import { LederOnly } from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";

interface LederOnlySubmitViewProps {
  lederFormData: LederOnly;
  lederInfo: LederInfo;
  onEdit: () => void;
}

export function LederOnlySubmitView({
  lederFormData,
  lederInfo,
  onEdit,
}: LederOnlySubmitViewProps) {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <ThankYouAlert />
        <LederInfoDescription />
        <LederOnlySummary
          onEdit={onEdit}
          lederFormData={lederFormData}
          lederInfo={lederInfo}
        />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
    </Page>
  );
}
