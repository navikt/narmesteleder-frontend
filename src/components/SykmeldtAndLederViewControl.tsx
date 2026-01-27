"use client";
import { SykmeldtAndLederViewControl as SykmeldtAndLederViewControlContext } from "@/context/sykmeldtAndLederContextState";
import { Lumi } from "./lumi/Lumi";
import { lumiSurvey } from "./lumi/lumiSurvey";
import { SykmeldAndtLederEditView } from "./SykmeldtAndLederEditView";
import { SykmeldtAndLederSubmitView } from "./SykmeldtAndLederSubmitView";

export function SykmeldAndtLederViewControl() {
  return (
    <>
      <SykmeldtAndLederViewControlContext
        EditView={SykmeldAndtLederEditView}
        SubmitView={SykmeldtAndLederSubmitView}
      />
      <Lumi feedbackId="sykmeldt-and-leder-feedback" survey={lumiSurvey} />
    </>
  );
}
