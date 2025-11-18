"use client";
import { LederOnlyEditView } from "@/components/LederOnlyEditView";
import { LederOnlySubmitView } from "@/components/LederOnlySubmitView";
import {
  LederOnlyFlowProvider,
  useLederOnlyFlow,
} from "@/context/LederOnlyFlowContext";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";

type LederOnlyFlowControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

function LederOnlyFlowContent() {
  const { mode } = useLederOnlyFlow();
  if (mode === "editing") {
    return <LederOnlyEditView />;
  }
  return <LederOnlySubmitView />;
}

export function LederOnlyFlowControl({
  lederInfo,
  behovId,
}: LederOnlyFlowControlProps) {
  return (
    <LederOnlyFlowProvider lederInfo={lederInfo} behovId={behovId}>
      <LederOnlyFlowContent />
    </LederOnlyFlowProvider>
  );
}
