import { BodyShort, Loader, VStack } from "@navikt/ds-react";
import { UiSelector } from "@/utils/uiSelectors";

export function OversiktSpinner() {
  return (
    <VStack
      align="center"
      justify="center"
      gap="space-12"
      paddingBlock="space-64"
      data-testid={UiSelector.OversiktLasterSpinner}
    >
      <Loader size="3xlarge" title="Laster oversikt" />
      <BodyShort aria-live="polite">Henter ansatte...</BodyShort>
    </VStack>
  );
}
