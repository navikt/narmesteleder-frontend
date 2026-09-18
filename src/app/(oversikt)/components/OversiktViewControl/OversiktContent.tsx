import {
  BodyLong,
  Button,
  Chips,
  Dialog,
  Heading,
  HGrid,
  Label,
  LocalAlert,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type ComponentProps,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useVirksomhetContext } from "@/shared/state/virksomhetContext";
import { joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";
import { filterBySearch } from "./filterBySearch";
import { OversiktHeadingLeder } from "./OversiktHeadingLeder";
import { OversiktTabell } from "./OversiktTabell";
import { useLinemanagerData } from "./useLinemanagerData";
import { useRequirementsData } from "./useRequirementsData";

type OversiktFilterValue =
  | "mangler-leder"
  | "aktiv-sykmelding"
  | "ikke-aktiv-sykmelding";

function getValidFilterValue(tab?: string): OversiktFilterValue {
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
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [isNavigationPending, startTransition] = useTransition();
  const activeFilter = getValidFilterValue(
    searchParams.get("tab") ?? selectedTab,
  );
  const selectedOrCurrentOrgnr = virksomhet.orgnummer || selectedOrgnr;
  const hasActiveSickLeave =
    activeFilter === "mangler-leder"
      ? null
      : activeFilter === "aktiv-sykmelding";
  const linemanagerData = useLinemanagerData({
    orgNumber: selectedOrCurrentOrgnr,
    hasActiveSickLeave,
    search: debouncedSearch,
  });
  const requirementsData = useRequirementsData({
    initialResult: requirementsResult,
    orgNumber: selectedOrCurrentOrgnr,
    enabled: activeFilter === "mangler-leder",
  });

  useEffect(() => {
    if (virksomhet.orgnummer && virksomhet.orgnummer !== selectedOrgnr) {
      startTransition(() => {
        router.push(`?orgnr=${virksomhet.orgnummer}&tab=${activeFilter}`);
      });
    }
  }, [virksomhet.orgnummer, selectedOrgnr, activeFilter, router]);

  const filteredRequirements = useMemo(
    () => filterBySearch(requirementsData.result.requirements, debouncedSearch),
    [requirementsData.result.requirements, debouncedSearch],
  );

  const handleFilterChange = (value: string) => {
    const nextFilter = getValidFilterValue(value);
    const params = new URLSearchParams(searchParams.toString());

    params.set("orgnr", selectedOrCurrentOrgnr);
    params.set("tab", nextFilter);

    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const isMissingLinemanagerFilter = activeFilter === "mangler-leder";
  const hasLoadError = isMissingLinemanagerFilter
    ? requirementsData.result.status === "error"
    : linemanagerData.result.status === "error";

  const tableProps: ComponentProps<typeof OversiktTabell> =
    isMissingLinemanagerFilter
      ? {
          variant: "missing-linemanager",
          requirements: filteredRequirements,
          orgNumber: selectedOrCurrentOrgnr,
          loading: isNavigationPending || requirementsData.isPending,
        }
      : {
          variant: "linemanager",
          linemanagers: linemanagerData.result.linemanagers,
          orgNumber: selectedOrCurrentOrgnr,
          hasActiveSickLeave: activeFilter === "aktiv-sykmelding",
          loading: isNavigationPending || linemanagerData.isPending,
          revokingKey: linemanagerData.revokingKey,
          onRevoke: linemanagerData.handleRevoke,
        };

  const filterDescription =
    activeFilter === "mangler-leder"
      ? "Viser ansatte som trenger registrert nærmeste leder."
      : activeFilter === "aktiv-sykmelding"
        ? "Viser ansatte med aktiv sykmelding."
        : "Viser ansatte uten aktiv sykmelding. Fjerner du nærmeste leder, vil den ansatte ikke lenger vises i oversikten.";

  const pendingEmployeeName = linemanagerData.pendingRevoke?.employee.name
    ? joinNonEmpty([
        linemanagerData.pendingRevoke.employee.name.firstName,
        linemanagerData.pendingRevoke.employee.name.middleName,
        linemanagerData.pendingRevoke.employee.name.lastName,
      ])
    : "den ansatte";

  return (
    <VStack gap="space-32">
      <OversiktHeadingLeder />

      <VStack gap="space-24">
        <VStack gap="space-4">
          <Heading level="2" size="medium">
            Ansatte
          </Heading>
          <BodyLong>Søk og filtrer ansatte i virksomheten.</BodyLong>
        </VStack>

        <HGrid
          columns={{ xs: 1, lg: "minmax(20rem, 1fr) auto" }}
          gap="space-24"
          align="end"
        >
          <TextField
            label="Søk etter ansatt"
            description="Søk med navn eller fødselsnummer"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            data-testid={UiSelector.OversiktSok}
            autoComplete="off"
          />
          <VStack gap="space-8">
            <Label>Status</Label>
            <Chips data-testid={UiSelector.OversiktFaner}>
              <Chips.Toggle
                selected={activeFilter === "mangler-leder"}
                onClick={() => handleFilterChange("mangler-leder")}
                data-color="neutral"
              >
                Mangler nærmeste leder
              </Chips.Toggle>
              <Chips.Toggle
                selected={activeFilter === "aktiv-sykmelding"}
                onClick={() => handleFilterChange("aktiv-sykmelding")}
                data-color="neutral"
              >
                Aktiv sykmelding
              </Chips.Toggle>
              <Chips.Toggle
                selected={activeFilter === "ikke-aktiv-sykmelding"}
                onClick={() => handleFilterChange("ikke-aktiv-sykmelding")}
                data-color="neutral"
              >
                Ingen aktiv sykmelding
              </Chips.Toggle>
            </Chips>
          </VStack>
        </HGrid>
      </VStack>

      <VStack gap="space-32">
        <BodyLong aria-live="polite" className="sr-only">
          {filterDescription}
        </BodyLong>

        {!isMissingLinemanagerFilter && linemanagerData.revokeSuccess && (
          <LocalAlert status="success">
            <LocalAlert.Header>
              <LocalAlert.Title>
                Den nærmeste lederen er fjernet
              </LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
              {linemanagerData.revokeSuccess}
            </LocalAlert.Content>
          </LocalAlert>
        )}

        {!isMissingLinemanagerFilter && linemanagerData.revokeError && (
          <LocalAlert
            status="error"
            data-testid={UiSelector.LinemanagerFeilAlert}
          >
            <LocalAlert.Header>
              <LocalAlert.Title>Kunne ikke fjerne leder</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
              {linemanagerData.revokeError}
            </LocalAlert.Content>
          </LocalAlert>
        )}

        {hasLoadError ? (
          <LocalAlert status="error" data-testid={UiSelector.OversiktFeilAlert}>
            <LocalAlert.Header>
              <LocalAlert.Title>Noe gikk galt</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
              Vi klarte ikke å hente oversikten. Prøv igjen litt senere.
            </LocalAlert.Content>
          </LocalAlert>
        ) : (
          <OversiktTabell {...tableProps} />
        )}

        {!isMissingLinemanagerFilter &&
          linemanagerData.result.meta?.hasMore && (
            <Button
              variant="secondary"
              onClick={linemanagerData.handleLoadMore}
              loading={linemanagerData.isPending}
              data-testid={UiSelector.LinemanagerLastFlere}
            >
              Last flere
            </Button>
          )}
      </VStack>

      <Dialog
        open={linemanagerData.pendingRevoke !== null}
        onOpenChange={(open) => {
          if (!open) {
            linemanagerData.closeRevokeDialog();
          }
        }}
      >
        <Dialog.Popup
          role="alertdialog"
          closeOnOutsideClick={false}
          width="small"
        >
          <Dialog.Header withClosebutton={!linemanagerData.isPending}>
            <Dialog.Title>Fjern nærmeste leder?</Dialog.Title>
            <Dialog.Description>
              Du er i ferd med å fjerne nærmeste leder for {pendingEmployeeName}
              .
              {hasActiveSickLeave === false &&
                " Den ansatte vil ikke lenger vises i denne oversikten."}{" "}
              Det kan ta litt tid før endringen vises.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button variant="secondary" disabled={linemanagerData.isPending}>
                Avbryt
              </Button>
            </Dialog.CloseTrigger>
            <Button
              data-color="danger"
              loading={linemanagerData.isPending}
              onClick={linemanagerData.confirmRevoke}
            >
              Fjern nærmeste leder
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </VStack>
  );
}

interface OversiktContentProps {
  requirementsResult: FetchRequirementsListResult;
  selectedOrgnr: string;
  selectedTab?: "mangler-leder" | "aktiv-sykmelding" | "ikke-aktiv-sykmelding";
}
