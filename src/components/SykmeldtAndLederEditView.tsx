import { VStack } from "@navikt/ds-react";
import { HeadingLeder } from "./HeadingLeder";
import SykmeldtAndLederInfoPanel from "./SykmeldtAndLederInfoPanel";
import RegistrerNarmesteLederRelasjon from "./form/RegistrerNarmesteLederRelasjon";

export function SykmeldAndtLederEditView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <SykmeldtAndLederInfoPanel />
      <RegistrerNarmesteLederRelasjon />
    </VStack>
  );
}
