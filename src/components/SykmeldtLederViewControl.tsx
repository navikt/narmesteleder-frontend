"use client";
import {
  SykmeldtLederProvider,
  useSykmeldtLederContextState,
} from "@/context/sykmeldtLederFlowContext";
import { SykmeldtLederEditView } from "./SykmeldtLederEditView";
import { SykmeldtLederSubmitView } from "./SykmeldtLederSubmitView";
import { ViewControl } from "./ViewControl";

export function SykmeldtLederViewControl() {
  return (
    <ViewControl
      Provider={SykmeldtLederProvider}
      useFlow={useSykmeldtLederContextState}
      EditView={SykmeldtLederEditView}
      SubmitView={SykmeldtLederSubmitView}
    />
  );
}
