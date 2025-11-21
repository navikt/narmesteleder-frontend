import { VStack } from "@navikt/ds-react";
import { HeadingLeder } from "./HeadingLeder";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";
import OppgiNarmesteLederForSykmeldt from "./form/OppgiNarmesteLederForSykmeldt";

export function LederEditView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <OppgiLederPanel />
      <SykmeldtBox />
      <OppgiNarmesteLederForSykmeldt />
    </VStack>
  );
}
