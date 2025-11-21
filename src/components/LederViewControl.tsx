"use client";
import { LederEditView } from "@/components/LederEditView";
import { LederSubmitView } from "@/components/LederSubmitView";
import { LederViewControl as LederViewControlContext } from "@/context/lederContextState";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";

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
