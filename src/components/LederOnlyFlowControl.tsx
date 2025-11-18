"use client";
import { LederOnlyEditView } from "@/components/LederOnlyEditView";
import { LederOnlySubmitView } from "@/components/LederOnlySubmitView";
import {
  LederOnlyFlowProvider,
  useLederOnlyFlow,
} from "@/context/LederOnlyFlowContext";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { FlowControl } from "./FlowControl";

type LederOnlyFlowControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function LederOnlyFlowControl({
  lederInfo,
  behovId,
}: LederOnlyFlowControlProps) {
  return (
    <FlowControl
      Provider={LederOnlyFlowProvider}
      useFlow={useLederOnlyFlow}
      EditView={LederOnlyEditView}
      SubmitView={LederOnlySubmitView}
      providerProps={{ lederInfo, behovId }}
    />
  );
}
