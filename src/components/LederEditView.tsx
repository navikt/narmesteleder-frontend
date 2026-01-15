import { VStack } from "@navikt/ds-react";
import OppgiNarmesteLederForSykmeldt from "./form/OppgiNarmesteLederForSykmeldt";
import { HeadingLeder } from "./HeadingLeder";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";

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
