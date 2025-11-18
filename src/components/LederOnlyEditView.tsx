import { Page, VStack } from "@navikt/ds-react";
import { HeadingLeder } from "./HeadingLeder";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";
import OppgiNarmesteLederForSykmeldt from "./form/OppgiNarmesteLederForSykmeldt";

export function LederOnlyEditView() {
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <OppgiLederPanel />
        <SykmeldtBox />
        <OppgiNarmesteLederForSykmeldt />
      </VStack>
    </Page>
  );
}
