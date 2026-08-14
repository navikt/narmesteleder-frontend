import {
  BodyLong,
  Heading,
  LocalAlert,
  Tabs,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useVirksomhetContext } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
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
        <Tabs
          value={activeTab}
          onChange={(value) => {
            const nextTab = getValidTabValue(value);
            setActiveTab(nextTab);
            startTransition(() => {
              router.push(`?orgnr=${selectedOrCurrentOrgnr}&tab=${nextTab}`);
            });
          }}
          data-testid={UiSelector.OversiktFaner}
        >
          <Tabs.List>
            <Tabs.Tab value="mangler-leder" label="Mangler leder" />
            <Tabs.Tab value="aktiv-sykmelding" label="Aktiv sykmelding" />
            <Tabs.Tab
              value="ikke-aktiv-sykmelding"
              label="Ikke aktiv sykmelding"
            />
          </Tabs.List>

          <Tabs.Panel value="mangler-leder">
            <VStack gap="space-32" paddingBlock="space-24 space-0">
              <Heading level="2" size="small">
                Sykmeldte ansatte uten leder
              </Heading>
              <BodyLong>
                Her ser du en oversikt over sykmeldte ansatte i virksomheten med
                behov for å bli tildelt nærmeste leder. Klikk på "Oppgi leder"
                for å legge til nærmeste leder for en ansatt.
              </BodyLong>

              <TextField
                label="Søk på navn eller fødselsnummer"
                size="medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid={UiSelector.OversiktSok}
                autoComplete="off"
              />

              <OversiktTabell
                requirements={filtered}
                orgnr={selectedOrCurrentOrgnr ?? ""}
                loading={isPending}
              />
            </VStack>
          </Tabs.Panel>

          <Tabs.Panel value="aktiv-sykmelding">
            <VStack paddingBlock="space-24 space-0">
              <LinemanagerContent
                orgNumber={selectedOrgnr}
                hasActiveSickLeave={true}
              />
            </VStack>
          </Tabs.Panel>

          <Tabs.Panel value="ikke-aktiv-sykmelding">
            <VStack paddingBlock="space-24 space-0">
              <LinemanagerContent
                orgNumber={selectedOrgnr}
                hasActiveSickLeave={false}
              />
            </VStack>
          </Tabs.Panel>
        </Tabs>
      )}
    </VStack>
  );
}

interface OversiktContentProps {
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
  selectedTab?: "mangler-leder" | "aktiv-sykmelding" | "ikke-aktiv-sykmelding";
}
