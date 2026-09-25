"use client";

import { useState } from "react";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import {
  type ValgtVirksomhet,
  VirksomhetProvider,
} from "@/shared/state/virksomhetContext";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

export function ViewControl({
  initialData,
  initialVirksomhet,
  isSykmeldtKnown,
  returnTo,
}: {
  initialData: NarmesteLederInfo;
  initialVirksomhet: ValgtVirksomhet;
  isSykmeldtKnown: boolean;
  returnTo?: string;
}) {
  const [submittedData, setSubmittedData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);

  return (
    <VirksomhetProvider initialVirksomhet={initialVirksomhet}>
      {submitted ? (
        <SubmitView returnTo={returnTo} />
      ) : (
        <EditView
          initialData={submittedData}
          isSykmeldtKnown={isSykmeldtKnown}
          returnTo={returnTo}
          onSuccess={(data) => {
            setSubmittedData(data);
            setSubmitted(true);
          }}
        />
      )}
    </VirksomhetProvider>
  );
}
