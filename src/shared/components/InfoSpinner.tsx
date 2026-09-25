import { BodyShort, Loader, VStack } from "@navikt/ds-react";
import { UiSelector } from "@/utils/uiSelectors";

export function InfoSpinner() {
  return (
    <VStack
      align="center"
      justify="center"
      gap="space-12"
      paddingBlock="space-64"
      data-testid={UiSelector.BehovLasterSpinner}
    >
      <Loader size="3xlarge" title="Laster" />
      <BodyShort aria-live="polite">Henter informasjon...</BodyShort>
    </VStack>
  );
}
