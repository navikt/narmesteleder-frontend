"use client";
import { SykmeldtAndLederViewControl as SykmeldtAndLederViewControlContext } from "@/context/sykmeldtAndLederContextState";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

export function ViewControl() {
  return (
    <SykmeldtAndLederViewControlContext
      EditView={EditView}
      SubmitView={SubmitView}
    />
  );
}
