import { VStack } from "@navikt/ds-react";
import { InfoSpinner } from "@/app/(behov)/[behovId]/components/InfoSpinner";

export function ReplacementSpinner() {
  return (
    <VStack gap="space-32">
      <InfoSpinner />
    </VStack>
  );
}
