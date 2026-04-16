"use client";
import { BehovViewControlProvider } from "@/app/(behov)/[behovId]/state/contextState";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

type ViewControlProps = {
  lederInfo: LederInfo;
  behovId: string;
};

export function ViewControl({ lederInfo, behovId }: ViewControlProps) {
  return (
    <VirksomhetProvider
      initialVirksomhet={{
        orgnummer: lederInfo.orgnummer,
        orgnavn: lederInfo.orgnavn ?? "",
      }}
      organisasjoner={isLocalOrDemo ? mockOrganisasjoner : undefined}
      isSelectable={isLocalOrDemo}
    >
      <BehovViewControlProvider
        EditView={EditView}
        SubmitView={SubmitView}
        lederInfo={lederInfo}
        behovId={behovId}
      />
    </VirksomhetProvider>
  );
}
