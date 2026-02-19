"use client";
import { LederViewControl as LederViewControlContext } from "@/context/lederContextState";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

type ViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function ViewControl({ lederInfo, behovId }: ViewControlProps) {
  return (
    <LederViewControlContext
      EditView={EditView}
      SubmitView={SubmitView}
      lederInfo={lederInfo}
      behovId={behovId}
    />
  );
}
