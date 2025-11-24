"use client";
import { SykmeldtAndLederViewControl as SykmeldtAndLederViewControlContext } from "@/context/sykmeldtAndLederContextState";
import { SykmeldAndtLederEditView } from "./SykmeldtAndLederEditView";
import { SykmeldtAndLederSubmitView } from "./SykmeldtAndLederSubmitView";

export function SykmeldAndtLederViewControl() {
  return (
    <SykmeldtAndLederViewControlContext
      EditView={SykmeldAndtLederEditView}
      SubmitView={SykmeldtAndLederSubmitView}
    />
  );
}
