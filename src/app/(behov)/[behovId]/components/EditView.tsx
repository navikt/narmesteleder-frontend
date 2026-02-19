import { VStack } from "@navikt/ds-react";
import OppgiNarmesteLederForSykmeldt from "@/components/form/OppgiNarmesteLederForSykmeldt";
import { HeadingLeder } from "@/components/HeadingLeder";
import OppgiLederPanel from "@/components/OppgiLederPanel";
import SykmeldtBox from "@/components/SykmeldtBox";

export function EditView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <OppgiLederPanel />
      <SykmeldtBox />
      <OppgiNarmesteLederForSykmeldt />
    </VStack>
  );
}
