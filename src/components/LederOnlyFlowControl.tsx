"use client";
import { LederOnlyEditView } from "@/components/LederOnlyEditView";
import { LederOnlySubmitView } from "@/components/LederOnlySubmitView";
import {
  LederOnlyFlowProvider,
  useLederOnlyFlow,
} from "@/context/lederOnlyFlowContext";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { ViewControl } from "./ViewControl";

type LederOnlyFlowControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function LederOnlyFlowControl({
  lederInfo,
  behovId,
}: LederOnlyFlowControlProps) {
  return (
    <ViewControl
      Provider={LederOnlyFlowProvider}
      useFlow={useLederOnlyFlow}
      EditView={LederOnlyEditView}
      SubmitView={LederOnlySubmitView}
      providerProps={{ lederInfo, behovId }}
    />
  );
}
