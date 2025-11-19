"use client";
import { LederEditView } from "@/components/LederEditView";
import { LederSubmitView } from "@/components/LederSubmitView";
import {
  LederProvider,
  useLederContextState,
} from "@/context/lederContextState";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { ViewControl } from "./ViewControl";

type LederViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function LederViewControl({
  lederInfo,
  behovId,
}: LederViewControlProps) {
  return (
    <ViewControl
      Provider={LederProvider}
      useContextState={useLederContextState}
      EditView={LederEditView}
      SubmitView={LederSubmitView}
      providerProps={{ lederInfo, behovId }}
    />
  );
}
