import { Page, VStack } from "@navikt/ds-react";
import { HeadingLeder } from "./HeadingLeder";
import SykmeldtAndLederInfoPanel from "./SykmeldtAndLederInfoPanel";
import RegistrerNarmesteLederRelasjon from "./form/RegistrerNarmesteLederRelasjon";

export function SykmeldAndtLederEditView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="space-32">
        <SykmeldtAndLederInfoPanel />
        <RegistrerNarmesteLederRelasjon />
      </VStack>
    </Page>
  );
}
