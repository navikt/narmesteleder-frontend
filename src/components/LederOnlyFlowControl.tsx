"use client";
import { useState } from "react";
import { LederOnlyEditView } from "@/components/LederOnlyEditView";
import { LederOnlySubmitView } from "@/components/LederOnlySubmitView";
import { LederOnly } from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";

type LederOnlyFlowControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

type LederFlowState =
  | { mode: "editing"; submittedData: LederOnly | null }
  | { mode: "submitted"; submittedData: LederOnly };

export function LederOnlyFlowControl({
  lederInfo,
  behovId,
}: LederOnlyFlowControlProps) {
  const [state, setState] = useState<LederFlowState>({
    mode: "editing",
    submittedData: null,
  });

  const handleSuccess = (data: LederOnly) => {
    setState({ mode: "submitted", submittedData: data });
  };

  if (state.mode === "editing") {
    return (
      <LederOnlyEditView
        lederInfo={lederInfo}
        behovId={behovId}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <LederOnlySubmitView
      lederFormData={state.submittedData}
      lederInfo={lederInfo}
    />
  );
}
