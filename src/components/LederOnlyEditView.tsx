import { Page, VStack } from "@navikt/ds-react";
import { LederOnly } from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { HeadingLeder } from "./HeadingLeder";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";
import OppgiNarmesteLederForSykmeldt from "./form/OppgiNarmesteLederForSykmeldt";

type LederOnlyEditViewProps = {
  lederInfo: LederInfo;
  behovId: string;
  onSuccess: (data: LederOnly) => void;
};

export function LederOnlyEditView({
  lederInfo,
  behovId,
  onSuccess,
}: LederOnlyEditViewProps) {
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
          onSuccess={onSuccess}
        />
      </VStack>
    </Page>
  );
}
