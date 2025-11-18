"use client";
import {
  SykmeldtLederFlowProvider,
  useSykmeldtLederFlow,
} from "@/context/SykmeldtLederFlowContext";
import { SykmeldtLederEditView } from "./SykmeldtLederEditView";
import { SykmeldtLederSubmitView } from "./SykmeldtLederSubmitView";

const SykmeldtLederFlowContent = () => {
  const { mode } = useSykmeldtLederFlow();
  if (mode === "editing") {
    return <SykmeldtLederEditView />;
  }
  return <SykmeldtLederSubmitView />;
};

export function SykmeldtLederFlowControl() {
  return (
    <SykmeldtLederFlowProvider>
      <SykmeldtLederFlowContent />
    </SykmeldtLederFlowProvider>
  );
}
