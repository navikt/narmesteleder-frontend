"use client";

import {
  HStack,
  LocalAlert,
  Tabs,
  Tag,
  TextField,
  VStack,
} from "@navikt/ds-react";
import type { Organisasjon } from "@navikt/virksomhetsvelger";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";
import type { FetchOrganisasjonerResult } from "@/server/fetchData/fetchOrganisasjoner";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import {
  useVirksomhetContext,
  VirksomhetProvider,
} from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktHeadingLeder } from "./OversiktHeadingLeder";
import { OversiktTabell } from "./OversiktTabell";

type TabVerdi = "ingen-leder" | "aktive" | "ikke-aktive";

interface OversiktViewControlProps {
  organisasjonerResult: FetchOrganisasjonerResult;
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
}

function findOrgNavn(orgnr: string, organisasjoner: Organisasjon[]): string {
  for (const org of organisasjoner) {
    if (org.orgnr === orgnr) return org.navn;
    const match = findOrgNavn(orgnr, org.underenheter);
    if (match) return match;
  }
  return "";
}

function filterByTab(
  requirements: RequirementsListItem[],
  tab: TabVerdi,
): RequirementsListItem[] {
  switch (tab) {
    case "ingen-leder":
      return requirements.filter((r) => r.managerIdentificationNumber === null);
    case "aktive":
      return requirements.filter((r) => r.isActive === true);
    case "ikke-aktive":
      return requirements.filter((r) => r.isActive === false);
  }
}

function filterBySearch(
  requirements: RequirementsListItem[],
  query: string,
): RequirementsListItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return requirements;

  return requirements.filter((r) => {
    const fullnavn = [r.name.firstName, r.name.middleName, r.name.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (fullnavn.includes(q)) return true;
    // FNR-søk: fjern mellomrom
    const fnrNormalisert = r.employeeIdentificationNumber.replace(/\s/g, "");
    const queryNormalisert = q.replace(/\s/g, "");
    return fnrNormalisert.includes(queryNormalisert);
  });
}

/**
 * Må ligge inne i VirksomhetProvider.
 * Detekterer orgnummer-endringer i headingen og navigerer til ny URL.
 */
function OversiktContent({
  requirements,
  selectedOrgnr,
}: {
  requirements: RequirementsListItem[];
  selectedOrgnr: string;
}) {
  const router = useRouter();
  const virksomhet = useVirksomhetContext();
  const [activeTab, setActiveTab] = useState<TabVerdi>("ingen-leder");
  const [search, setSearch] = useState("");

  // Nullstill søk ved tab-bytte for å unngå forvirring
  const handleTabChange = (val: string) => {
    if (val !== "ingen-leder") return;
    setActiveTab(val as TabVerdi);
    setSearch("");
  };

  // Naviger til ny URL når virksomhet endres i heading → trigger ny server-fetch
  useEffect(() => {
    if (virksomhet.orgnummer && virksomhet.orgnummer !== selectedOrgnr) {
      router.push(`?orgnr=${virksomhet.orgnummer}`);
    }
  }, [virksomhet.orgnummer, selectedOrgnr, router]);

  const tabFiltered = useMemo(
    () => filterByTab(requirements, activeTab),
    [requirements, activeTab],
  );

  const filtered = useMemo(
    () => filterBySearch(tabFiltered, search),
    [tabFiltered, search],
  );

  const ingenLederCount = useMemo(
    () =>
      requirements.filter((r) => r.managerIdentificationNumber === null).length,
    [requirements],
  );

  return (
    <VStack gap="space-32">
      <OversiktHeadingLeder />

      <LocalAlert
        status="announcement"
        data-testid={UiSelector.OversiktInfoboks}
      >
        <LocalAlert.Header>
          <LocalAlert.Title>Oversikt over sykmeldte ansatte</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          Her ser du sykmeldte ansatte i valgt virksomhet. Ansatte som mangler
          nærmeste leder vises i fanen «Mangler nærmeste leder». Du kan oppgi
          eller endre nærmeste leder direkte i tabellen.
        </LocalAlert.Content>
      </LocalAlert>

      <TextField
        label="Søk på navn eller fødselsnummer"
        size="medium"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        data-testid={UiSelector.OversiktSok}
        autoComplete="off"
      />

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        data-testid={UiSelector.OversiktFaner}
      >
        <Tabs.List>
          <Tabs.Tab
            value="ingen-leder"
            label={`Mangler nærmeste leder (${ingenLederCount})`}
          />
          <Tabs.Tab
            value="aktive"
            aria-disabled
            label={
              <HStack gap="space-8" align="center" wrap={false}>
                <span>Aktive sykefravær</span>
                <Tag variant="neutral" size="small">
                  Kommer snart
                </Tag>
              </HStack>
            }
          />
          <Tabs.Tab
            value="ikke-aktive"
            aria-disabled
            label={
              <HStack gap="space-8" align="center" wrap={false}>
                <span>Ikke aktive</span>
                <Tag variant="neutral" size="small">
                  Kommer snart
                </Tag>
              </HStack>
            }
          />
        </Tabs.List>

        <Tabs.Panel value="ingen-leder">
          <OversiktTabell requirements={filtered} />
        </Tabs.Panel>
        <Tabs.Panel value="aktive">
          <OversiktTabell requirements={filtered} />
        </Tabs.Panel>
        <Tabs.Panel value="ikke-aktive">
          <OversiktTabell requirements={filtered} />
        </Tabs.Panel>
      </Tabs>
    </VStack>
  );
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

  if (requirementsResult.status === "error") {
    return (
      <VStack gap="space-32">
        <OversiktHeadingLeder readOnlyVirksomhet />
        <LocalAlert status="error" data-testid={UiSelector.OversiktFeilAlert}>
          <LocalAlert.Header>
            <LocalAlert.Title>Noe gikk galt</LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            Vi klarte ikke å hente oversikten. Prøv igjen litt senere.
          </LocalAlert.Content>
        </LocalAlert>
      </VStack>
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
        requirements={requirementsResult.requirements}
        selectedOrgnr={selectedOrgnr}
      />
    </VirksomhetProvider>
  );
}
