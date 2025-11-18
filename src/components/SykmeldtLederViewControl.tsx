"use client";
import {
  SykmeldtLederFlowProvider,
  useSykmeldtLederFlow,
} from "@/context/sykmeldtLederFlowContext";
import { SykmeldtLederEditView } from "./SykmeldtLederEditView";
import { SykmeldtLederSubmitView } from "./SykmeldtLederSubmitView";
import { ViewControl } from "./ViewControl";

export function SykmeldtLederViewControl() {
  return (
    <ViewControl
      Provider={SykmeldtLederFlowProvider}
      useFlow={useSykmeldtLederFlow}
      EditView={SykmeldtLederEditView}
      SubmitView={SykmeldtLederSubmitView}
    />
  );
}
