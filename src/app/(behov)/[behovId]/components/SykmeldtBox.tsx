import { useBehovContextState } from "@/app/(behov)/[behovId]/state/contextState";
import { SykmeldtInfoBox } from "@/shared/components/SykmeldtInfoBox";
import { UiSelector } from "@/utils/uiSelectors";

export default function SykmeldtBox() {
  const { lederInfo } = useBehovContextState();
  return (
    <SykmeldtInfoBox
      fields={[
        { label: "Navn", value: lederInfo.sykmeldt.fullnavn },
        { label: "Fødselsnummer", value: lederInfo.sykmeldtFnr },
      ]}
      testId={UiSelector.SykmeldtBox}
    />
  );
}
