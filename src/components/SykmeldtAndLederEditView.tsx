import { Page, VStack } from "@navikt/ds-react";
import { HeadingLeder } from "./HeadingLeder";
import RegistrerNarmesteLederRelasjon from "./form/RegistrerNarmesteLederRelasjon";

export function SykmeldAndtLederEditView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <RegistrerNarmesteLederRelasjon />
      </VStack>
    </Page>
  );
}
