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
}

export function LederOnlySubmitView({
  lederFormData,
  lederInfo,
}: LederOnlySubmitViewProps) {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <ThankYouAlert />
        <LederInfoDescription />
        <LederOnlySummary lederFormData={lederFormData} lederInfo={lederInfo} />
        <HStack>
          <ExitButton />
        </HStack>
      </VStack>
    </Page>
  );
}
