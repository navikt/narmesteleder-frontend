"use client";
import { LocalAlert } from "@navikt/ds-react";
import { RegistreringViewControlProvider } from "@/app/(registrering)/state/contextState";
import type { FetchOrganisasjonerResult } from "@/server/fetchData/fetchOrganisasjoner";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

type ViewControlProps = {
  organisasjonerResult: FetchOrganisasjonerResult;
};

function BlockedOrganisasjonerAlert({
  status,
}: {
  status: Exclude<FetchOrganisasjonerResult["status"], "available">;
}) {
  const content =
    status === "empty"
      ? "Vi fant ingen virksomheter du kan velge mellom. Kontakt NAV hvis du trenger hjelp videre."
      : "Vi klarte ikke å hente virksomhetene dine. Prøv igjen litt senere.";

  return (
    <LocalAlert status="error" data-testid={UiSelector.OrganisasjonerLoadError}>
      <LocalAlert.Header>
        <LocalAlert.Title>
          Du kan ikke registrere nærmeste leder akkurat nå
        </LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>{content}</LocalAlert.Content>
    </LocalAlert>
  );
}

export function ViewControl({ organisasjonerResult }: ViewControlProps) {
  if (organisasjonerResult.status !== "available") {
    return <BlockedOrganisasjonerAlert status={organisasjonerResult.status} />;
  }

  return (
    <VirksomhetProvider
      organisasjoner={organisasjonerResult.organisasjoner}
      isRequired
      isSelectable
    >
      <RegistreringViewControlProvider
        EditView={EditView}
        SubmitView={SubmitView}
      />
    </VirksomhetProvider>
  );
}
