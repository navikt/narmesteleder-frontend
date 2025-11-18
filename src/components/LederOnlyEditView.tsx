import { Page, VStack } from "@navikt/ds-react";
import { useLederOnlyFlow } from "@/context/LederOnlyFlowContext";
import { HeadingLeder } from "./HeadingLeder";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";
import OppgiNarmesteLederForSykmeldt from "./form/OppgiNarmesteLederForSykmeldt";

export function LederOnlyEditView() {
  const { submittedData, handleSuccess, lederInfo, behovId } =
    useLederOnlyFlow();
  return (
    <Page>
      <HeadingLeder />
      <VStack gap="8">
        <OppgiLederPanel lederInfo={lederInfo} />
        <SykmeldtBox
          fodselsnummer={lederInfo.sykmeldtFnr}
          navn={lederInfo.sykmeldt.fullnavn}
        />
        <OppgiNarmesteLederForSykmeldt
          behovId={behovId}
          onSuccess={handleSuccess}
          initialData={submittedData}
        />
      </VStack>
    </Page>
  );
}
