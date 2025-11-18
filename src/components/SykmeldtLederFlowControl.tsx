"use client";
import {
  SykmeldtLederFlowProvider,
  useSykmeldtLederFlow,
} from "@/context/SykmeldtLederFlowContext";
import { FlowControl } from "./FlowControl";
import { SykmeldtLederEditView } from "./SykmeldtLederEditView";
import { SykmeldtLederSubmitView } from "./SykmeldtLederSubmitView";

export function SykmeldtLederFlowControl() {
  return (
    <FlowControl
      Provider={SykmeldtLederFlowProvider}
      useFlow={useSykmeldtLederFlow}
      EditView={SykmeldtLederEditView}
      SubmitView={SykmeldtLederSubmitView}
    />
  );
}
