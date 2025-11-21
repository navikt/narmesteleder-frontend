import { Page, VStack } from "@navikt/ds-react";
import { HeadingLeder } from "./HeadingLeder";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";
import OppgiNarmesteLederForSykmeldt from "./form/OppgiNarmesteLederForSykmeldt";

export function LederEditView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="space-32">
        <OppgiLederPanel />
        <SykmeldtBox />
        <OppgiNarmesteLederForSykmeldt />
      </VStack>
    </Page>
  );
}
