import { VStack } from "@navikt/ds-react";
import RegistrerNarmesteLederRelasjon from "@/components/form/RegistrerNarmesteLederRelasjon";
import { HeadingLeder } from "@/components/HeadingLeder";
import InfoPanel from "./InfoPanel";

export function EditView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <InfoPanel />
      <RegistrerNarmesteLederRelasjon />
    </VStack>
  );
}
