import { LocalAlert, TextField, VStack } from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useVirksomhetContext } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";
import { filterBySearch } from "./filterBySearch";
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

  // Naviger til ny URL når virksomhet endres i heading → trigger ny server-fetch
  useEffect(() => {
    if (virksomhet.orgnummer && virksomhet.orgnummer !== selectedOrgnr) {
      router.push(`?orgnr=${virksomhet.orgnummer}`);
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
        <>
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

          <OversiktTabell requirements={filtered} />
        </>
      )}
    </VStack>
  );
}

interface OversiktContentProps {
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
}
