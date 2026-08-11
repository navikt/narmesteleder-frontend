import { LocalAlert, Tabs, TextField, VStack } from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { isNonProd } from "@/env-variables/envHelpers";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useVirksomhetContext } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
import { filterBySearch } from "./filterBySearch";
import { LinemanagerContent } from "./LinemanagerContent";
import { OversiktHeadingLeder } from "./OversiktHeadingLeder";
import { OversiktTabell } from "./OversiktTabell";

/**
 * Må ligge inne i VirksomhetProvider.
 * Detekterer orgnummer-endringer i headingen og navigerer til ny URL.
 */
export function OversiktContent({
  requirementsResult,
  selectedOrgnr,
}: OversiktContentProps) {
  const router = useRouter();
  const virksomhet = useVirksomhetContext();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const requirements = requirementsResult.requirements;
  const [isPending, startTransition] = useTransition();

  // Naviger til ny URL når virksomhet endres i heading → trigger ny server-fetch
  useEffect(() => {
    if (virksomhet.orgnummer && virksomhet.orgnummer !== selectedOrgnr) {
      startTransition(() => {
        router.push(`?orgnr=${virksomhet.orgnummer}`);
      });
    }
  }, [virksomhet.orgnummer, selectedOrgnr, router]);

  const filtered = useMemo(
    () => filterBySearch(requirements, debouncedSearch),
    [requirements, debouncedSearch],
  );

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
          defaultValue="mangler-leder"
          data-testid={UiSelector.OversiktFaner}
        >
          <Tabs.List>
            <Tabs.Tab value="mangler-leder" label="Mangler leder" />
            {isNonProd && (
              <Tabs.Tab value="aktiv-sykmelding" label="Aktiv sykmelding" />
            )}
            {isNonProd && (
              <Tabs.Tab
                value="ikke-aktiv-sykmelding"
                label="Ikke aktiv sykmelding"
              />
            )}
          </Tabs.List>

          <Tabs.Panel value="mangler-leder">
            <VStack gap="space-32" paddingBlock="space-24 space-0">
              <LocalAlert
                status="announcement"
                data-testid={UiSelector.OversiktInfoboks}
              >
                <LocalAlert.Header>
                  <LocalAlert.Title>
                    Oversikt over sykmeldte ansatte
                  </LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                  Her ser du en oversikt over sykmeldte ansatte i virksomheten.
                  Klikk på "Oppgi leder" for å legge til nærmeste leder for en
                  ansatt.
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

              <OversiktTabell requirements={filtered} loading={isPending} />
            </VStack>
          </Tabs.Panel>

          {isNonProd && (
            <Tabs.Panel value="aktiv-sykmelding">
              <VStack paddingBlock="space-24 space-0">
                <LinemanagerContent
                  orgNumber={selectedOrgnr}
                  hasActiveSickLeave={true}
                />
              </VStack>
            </Tabs.Panel>
          )}

          {isNonProd && (
            <Tabs.Panel value="ikke-aktiv-sykmelding">
              <VStack paddingBlock="space-24 space-0">
                <LinemanagerContent
                  orgNumber={selectedOrgnr}
                  hasActiveSickLeave={false}
                />
              </VStack>
            </Tabs.Panel>
          )}
        </Tabs>
      )}
    </VStack>
  );
}

interface OversiktContentProps {
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
}
