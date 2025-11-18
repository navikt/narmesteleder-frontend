"use client";
import {
  SykmeldtLederProvider,
  useSykmeldtLederContextState,
} from "@/context/sykmeldtLederContextState";
import { SykmeldtLederEditView } from "./SykmeldtLederEditView";
import { SykmeldtLederSubmitView } from "./SykmeldtLederSubmitView";
import { ViewControl } from "./ViewControl";

export function SykmeldtLederViewControl() {
  return (
    <ViewControl
      Provider={SykmeldtLederProvider}
      useMode={useSykmeldtLederContextState}
      EditView={SykmeldtLederEditView}
      SubmitView={SykmeldtLederSubmitView}
    />
  );
}
