import { Page, VStack } from "@navikt/ds-react";
import { HeadingLeder } from "./HeadingLeder";
import SykmeldtAndLederInfoPanel from "./SykmeldtAndLederInfoPanel";
import RegistrerNarmesteLederRelasjon from "./form/RegistrerNarmesteLederRelasjon";

export function SykmeldAndtLederEditView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <SykmeldtAndLederInfoPanel />
        <RegistrerNarmesteLederRelasjon />
      </VStack>
    </Page>
  );
}
