"use client";
import { LederOnlyEditView } from "@/components/LederOnlyEditView";
import { LederOnlySubmitView } from "@/components/LederOnlySubmitView";
import {
  LederOnlyProvider,
  useLederOnlyContextState,
} from "@/context/lederOnlyContextState";
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
      Provider={LederOnlyProvider}
      useContextState={useLederOnlyContextState}
      EditView={LederOnlyEditView}
      SubmitView={LederOnlySubmitView}
      providerProps={{ lederInfo, behovId }}
    />
  );
}
