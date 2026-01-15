import { VStack } from "@navikt/ds-react";
import RegistrerNarmesteLederRelasjon from "./form/RegistrerNarmesteLederRelasjon";
import { HeadingLeder } from "./HeadingLeder";
import SykmeldtAndLederInfoPanel from "./SykmeldtAndLederInfoPanel";

export function SykmeldAndtLederEditView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <SykmeldtAndLederInfoPanel />
      <RegistrerNarmesteLederRelasjon />
    </VStack>
  );
}
