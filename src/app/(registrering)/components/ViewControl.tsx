"use client";
import { RegistreringViewControlProvider } from "@/app/(registrering)/state/contextState";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

export function ViewControl() {
  return (
    <VirksomhetProvider
      organisasjoner={isLocalOrDemo ? mockOrganisasjoner : undefined}
      isRequired={isLocalOrDemo}
      isSelectable={isLocalOrDemo}
    >
      <RegistreringViewControlProvider
        EditView={EditView}
        SubmitView={SubmitView}
      />
    </VirksomhetProvider>
  );
}
