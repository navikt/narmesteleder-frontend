"use client";
import { LederViewControl as LederViewControlContext } from "@/context/lederContextState";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { LederEditView } from "./LederEditView";
import { LederSubmitView } from "./LederSubmitView";

type LederViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function LederViewControl({
  lederInfo,
  behovId,
}: LederViewControlProps) {
  return (
    <LederViewControlContext
      EditView={LederEditView}
      SubmitView={LederSubmitView}
      lederInfo={lederInfo}
      behovId={behovId}
    />
  );
}
