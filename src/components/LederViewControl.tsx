"use client";
import { LederEditView } from "@/components/LederEditView";
import { LederSubmitView } from "@/components/LederSubmitView";
import { LederViewControl as LederViewControlContext } from "@/context/lederContextState";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { Lumi } from "./lumi/Lumi";
import { lumiSurvey } from "./lumi/lumiSurvey";

type LederViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function LederViewControl({
  lederInfo,
  behovId,
}: LederViewControlProps) {
  return (
    <>
      <LederViewControlContext
        EditView={LederEditView}
        SubmitView={LederSubmitView}
        lederInfo={lederInfo}
        behovId={behovId}
      />
      <Lumi feedbackId="leder-feedback" survey={lumiSurvey} />
    </>
  );
}
