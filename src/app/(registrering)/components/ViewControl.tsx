"use client";
import { LocalAlert } from "@navikt/ds-react";
import type { Organisasjon } from "@navikt/virksomhetsvelger";
import { RegistreringViewControlProvider } from "@/app/(registrering)/state/contextState";
import type { FetchOrganisasjonerResult } from "@/server/fetchData/fetchOrganisasjoner";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
import { EditView } from "./EditView";
import { SubmitView } from "./SubmitView";

type ViewControlProps = {
  organisasjonerResult: FetchOrganisasjonerResult;
  initialOrgnr?: string;
  returnTo?: string;
};

function findOrgNavn(orgnr: string, organisasjoner: Organisasjon[]): string {
  for (const org of organisasjoner) {
    if (org.orgnr === orgnr) return org.navn;
    const nested = findOrgNavn(orgnr, org.underenheter);
    if (nested) return nested;
  }
  return "";
}

function BlockedOrganisasjonerAlert({
  status,
}: {
  status: Exclude<FetchOrganisasjonerResult["status"], "available">;
}) {
  const content =
    status === "empty"
      ? "Vi fant ingen virksomheter du kan velge mellom. Sjekk om du har tilstrekkelig rettigheter i Altinn."
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

export function ViewControl({
  organisasjonerResult,
  initialOrgnr,
  returnTo,
}: ViewControlProps) {
  if (organisasjonerResult.status !== "available") {
    return <BlockedOrganisasjonerAlert status={organisasjonerResult.status} />;
  }

  const initialOrgnavn = initialOrgnr
    ? findOrgNavn(initialOrgnr, organisasjonerResult.organisasjoner)
    : "";
  const initialVirksomhet =
    initialOrgnr && initialOrgnavn
      ? {
          orgnummer: initialOrgnr,
          orgnavn: initialOrgnavn,
        }
      : undefined;

  return (
    <VirksomhetProvider
      organisasjoner={organisasjonerResult.organisasjoner}
      initialVirksomhet={initialVirksomhet}
      isRequired
      isSelectable
    >
      <RegistreringViewControlProvider
        EditView={EditView}
        SubmitView={SubmitView}
        returnTo={returnTo}
      />
    </VirksomhetProvider>
  );
}
