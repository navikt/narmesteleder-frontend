"use client";
import { BehovViewControlProvider } from "@/app/(behov)/[behovId]/state/contextState";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

type ViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function ViewControl({ lederInfo, behovId }: ViewControlProps) {
  return (
    <BehovViewControlProvider
      EditView={EditView}
      SubmitView={SubmitView}
      lederInfo={lederInfo}
      behovId={behovId}
    />
  );
}
