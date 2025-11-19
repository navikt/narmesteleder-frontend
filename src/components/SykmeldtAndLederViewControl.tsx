"use client";
import {
  SykmeldtAndLederProvider,
  useSykmeldtAndLederContextState,
} from "@/context/sykmeldtAndLederContextState";
import { SykmeldAndtLederEditView } from "./SykmeldtAndLederEditView";
import { SykmeldtAndLederSubmitView } from "./SykmeldtAndLederSubmitView";
import { ViewControl } from "./ViewControl";

export function SykmeldAndtLederViewControl() {
  return (
    <ViewControl
      Provider={SykmeldtAndLederProvider}
      useContextState={useSykmeldtAndLederContextState}
      EditView={SykmeldAndtLederEditView}
      SubmitView={SykmeldtAndLederSubmitView}
    />
  );
}
