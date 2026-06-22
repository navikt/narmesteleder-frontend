"use client";

import { LocalAlert } from "@navikt/ds-react";
import type { Organisasjon } from "@navikt/virksomhetsvelger";
import type { FetchOrganisasjonerResult } from "@/server/fetchData/fetchOrganisasjoner";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktContent } from "./OversiktContent";

function findOrgNavn(orgnr: string, organisasjoner: Organisasjon[]): string {
  for (const org of organisasjoner) {
    if (org.orgnr === orgnr) return org.navn;
    const match = findOrgNavn(orgnr, org.underenheter);
    if (match) return match;
  }
  return "";
}

export function OversiktViewControl({
  organisasjonerResult,
  requirementsResult,
  selectedOrgnr,
}: OversiktViewControlProps) {
  if (organisasjonerResult.status !== "available") {
    const content =
      organisasjonerResult.status === "empty"
        ? "Vi fant ingen virksomheter du kan velge mellom. Sjekk om du har tilstrekkelig rettigheter i Altinn."
        : "Vi klarte ikke å hente virksomhetene dine. Prøv igjen litt senere.";

    return (
      <LocalAlert
        status="error"
        data-testid={UiSelector.OrganisasjonerLoadError}
      >
        <LocalAlert.Header>
          <LocalAlert.Title>
            Du kan ikke se oversikten akkurat nå
          </LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>{content}</LocalAlert.Content>
      </LocalAlert>
    );
  }

  const orgnavn = findOrgNavn(
    selectedOrgnr,
    organisasjonerResult.organisasjoner,
  );

  return (
    <VirksomhetProvider
      organisasjoner={organisasjonerResult.organisasjoner}
      initialVirksomhet={{ orgnummer: selectedOrgnr, orgnavn }}
      isSelectable
      label="Virksomhet"
      description="Velg virksomheten du vil se oversikt for."
    >
      <OversiktContent
        requirementsResult={requirementsResult}
        selectedOrgnr={selectedOrgnr}
      />
    </VirksomhetProvider>
  );
}

interface OversiktViewControlProps {
  organisasjonerResult: FetchOrganisasjonerResult;
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
}
