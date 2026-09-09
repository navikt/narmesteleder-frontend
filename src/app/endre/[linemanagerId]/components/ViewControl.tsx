"use client";

import { useState } from "react";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

export function ViewControl({
  initialData,
  returnTo,
}: {
  initialData: NarmesteLederInfo;
  returnTo?: string;
}) {
  const [submittedData, setSubmittedData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <SubmitView returnTo={returnTo} />;
  }

  return (
    <EditView
      initialData={submittedData}
      returnTo={returnTo}
      onSuccess={(data) => {
        setSubmittedData(data);
        setSubmitted(true);
      }}
    />
  );
}
