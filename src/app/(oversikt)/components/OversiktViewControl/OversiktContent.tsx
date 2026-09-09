import {
  BodyLong,
  BodyShort,
  Chips,
  Heading,
  LocalAlert,
  VStack,
} from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useVirksomhetContext } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
import { ExpandableSearch } from "./ExpandableSearch";
import { filterBySearch } from "./filterBySearch";
import { LinemanagerContent } from "./LinemanagerContent";
import { OversiktHeadingLeder } from "./OversiktHeadingLeder";
import { OversiktTabell } from "./OversiktTabell";

type OversiktTabValue =
  | "mangler-leder"
  | "aktiv-sykmelding"
  | "ikke-aktiv-sykmelding";

function getValidTabValue(tab?: string): OversiktTabValue {
  return tab === "aktiv-sykmelding" || tab === "ikke-aktiv-sykmelding"
    ? tab
    : "mangler-leder";
}

/**
 * Må ligge inne i VirksomhetProvider.
 * Detekterer orgnummer-endringer i headingen og navigerer til ny URL.
 */
export function OversiktContent({
  requirementsResult,
  selectedOrgnr,
  selectedTab,
}: OversiktContentProps) {
  const router = useRouter();
  const virksomhet = useVirksomhetContext();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const requirements = requirementsResult.requirements;
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<OversiktTabValue>(
    getValidTabValue(selectedTab),
  );

  useEffect(() => {
    setActiveTab(getValidTabValue(selectedTab));
  }, [selectedTab]);

  // Naviger til ny URL når virksomhet endres i heading → trigger ny server-fetch
  useEffect(() => {
    if (virksomhet.orgnummer && virksomhet.orgnummer !== selectedOrgnr) {
      startTransition(() => {
        router.push(`?orgnr=${virksomhet.orgnummer}&tab=${activeTab}`);
      });
    }
  }, [virksomhet.orgnummer, selectedOrgnr, activeTab, router]);

  const filtered = useMemo(
    () => filterBySearch(requirements, debouncedSearch),
    [requirements, debouncedSearch],
  );
  const selectedOrCurrentOrgnr = virksomhet.orgnummer || selectedOrgnr;

  const handleTabChange = (value: string) => {
    const nextTab = getValidTabValue(value);
    setActiveTab(nextTab);
    startTransition(() => {
      router.push(`?orgnr=${selectedOrCurrentOrgnr}&tab=${nextTab}`);
    });
  };

  return (
    <VStack gap="space-32">
      <OversiktHeadingLeder />

      {requirementsResult.status === "error" ? (
        <LocalAlert status="error" data-testid={UiSelector.OversiktFeilAlert}>
          <LocalAlert.Header>
            <LocalAlert.Title>Noe gikk galt</LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            Vi klarte ikke å hente oversikten. Prøv igjen litt senere.
          </LocalAlert.Content>
        </LocalAlert>
      ) : (
        <>
          <VStack gap="space-8">
            <BodyShort weight="semibold">Vis ansatte</BodyShort>
            <Chips data-testid={UiSelector.OversiktFaner}>
              <Chips.Toggle
                selected={activeTab === "mangler-leder"}
                onClick={() => handleTabChange("mangler-leder")}
                data-color="neutral"
              >
                Mangler nærmeste leder
              </Chips.Toggle>
              <Chips.Toggle
                selected={activeTab === "aktiv-sykmelding"}
                onClick={() => handleTabChange("aktiv-sykmelding")}
                data-color="neutral"
              >
                Aktiv sykmelding
              </Chips.Toggle>
              <Chips.Toggle
                selected={activeTab === "ikke-aktiv-sykmelding"}
                onClick={() => handleTabChange("ikke-aktiv-sykmelding")}
                data-color="neutral"
              >
                Ingen aktiv sykmelding
              </Chips.Toggle>
            </Chips>
          </VStack>

          {activeTab === "mangler-leder" && (
            <VStack gap="space-32" paddingBlock="space-24 space-0">
              <ExpandableSearch
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid={UiSelector.OversiktSok}
              />

              <Heading level="2" size="small">
                Ansatte som mangler nærmeste leder
              </Heading>
              <BodyLong>
                Disse ansatte må få registrert en nærmeste leder.
              </BodyLong>

              <OversiktTabell
                requirements={filtered}
                orgnr={selectedOrCurrentOrgnr ?? ""}
                loading={isPending}
              />
            </VStack>
          )}

          {activeTab === "aktiv-sykmelding" && (
            <VStack paddingBlock="space-24 space-0">
              <LinemanagerContent
                key="aktiv-sykmelding"
                orgNumber={selectedOrgnr}
                hasActiveSickLeave={true}
              />
            </VStack>
          )}

          {activeTab === "ikke-aktiv-sykmelding" && (
            <VStack paddingBlock="space-24 space-0">
              <LinemanagerContent
                key="ikke-aktiv-sykmelding"
                orgNumber={selectedOrgnr}
                hasActiveSickLeave={false}
              />
            </VStack>
          )}
        </>
      )}
    </VStack>
  );
}

interface OversiktContentProps {
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
  selectedTab?: "mangler-leder" | "aktiv-sykmelding" | "ikke-aktiv-sykmelding";
}
