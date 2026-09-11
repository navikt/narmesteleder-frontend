"use client";

import { LocalAlert } from "@navikt/ds-react";
import type { FetchOrganisasjonerResult } from "@/server/fetchData/fetchOrganisasjoner";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";
import { findOrganisasjonNavn } from "@/utils/findOrganisasjonNavn";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktContent } from "./OversiktContent";

export function OversiktViewControl({
  organisasjonerResult,
  requirementsResult,
  selectedOrgnr,
  selectedTab,
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

  const orgnavn = findOrganisasjonNavn(
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
        selectedTab={selectedTab}
      />
    </VirksomhetProvider>
  );
}

interface OversiktViewControlProps {
  organisasjonerResult: FetchOrganisasjonerResult;
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
  selectedTab?: "mangler-leder" | "aktiv-sykmelding" | "ikke-aktiv-sykmelding";
}
