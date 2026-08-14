"use client";
import { BehovViewControlProvider } from "@/app/(behov)/[behovId]/state/contextState";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

type ViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
  returnTo?: string;
};

export function ViewControl({
  lederInfo,
  behovId,
  returnTo,
}: ViewControlProps) {
  return (
    <VirksomhetProvider
      initialVirksomhet={{
        orgnummer: lederInfo.orgnummer,
        orgnavn: lederInfo.orgnavn ?? "",
      }}
      isSelectable={false}
    >
      <BehovViewControlProvider
        EditView={EditView}
        SubmitView={SubmitView}
        lederInfo={lederInfo}
        behovId={behovId}
        returnTo={returnTo}
      />
    </VirksomhetProvider>
  );
}
