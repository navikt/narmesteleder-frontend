"use client";
import { LederOnlyEditView } from "@/components/LederOnlyEditView";
import { LederOnlySubmitView } from "@/components/LederOnlySubmitView";
import {
  LederOnlyFlowProvider,
  useLederOnlyContextState,
} from "@/context/lederOnlyFlowContext";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { ViewControl } from "./ViewControl";

type LederOnlyViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function LederOnlyViewControl({
  lederInfo,
  behovId,
}: LederOnlyViewControlProps) {
  return (
    <ViewControl
      Provider={LederOnlyFlowProvider}
      useFlow={useLederOnlyContextState}
      EditView={LederOnlyEditView}
      SubmitView={LederOnlySubmitView}
      providerProps={{ lederInfo, behovId }}
    />
  );
}
