import { VStack } from "@navikt/ds-react";
import { HeadingLeder } from "@/components/HeadingLeder";
import InfoPanel from "./InfoPanel";
import RegistreringForm from "./RegistreringForm";

export function EditView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <InfoPanel />
      <RegistreringForm />
    </VStack>
  );
}
