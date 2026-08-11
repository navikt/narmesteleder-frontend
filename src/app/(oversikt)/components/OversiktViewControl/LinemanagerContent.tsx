"use client";

import { Button, LocalAlert, TextField, VStack } from "@navikt/ds-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { FetchLinemanagerSearchResult } from "@/server/fetchData/fetchLinemanagerSearch";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { UiSelector } from "@/utils/uiSelectors";
import { searchLinemanagersAction } from "../../actions/searchLinemanagers";
import { LinemanagerTabell } from "./LinemanagerTabell";

interface LinemanagerContentProps {
  orgNumber: string;
  hasActiveSickLeave: boolean;
}

const emptyResult: FetchLinemanagerSearchResult = {
  status: "empty",
  linemanagers: [],
  meta: null,
};

export function LinemanagerContent({
  orgNumber,
  hasActiveSickLeave,
}: LinemanagerContentProps) {
  const [result, setResult] =
    useState<FetchLinemanagerSearchResult>(emptyResult);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const debouncedSearch = useDebounce(search, 1000);

  // Fetch on mount and whenever orgNumber, hasActiveSickLeave or search changes.
  useEffect(() => {
    startTransition(async () => {
      const fresh = await searchLinemanagersAction({
        orgNumber,
        hasActiveSickLeave,
        text: debouncedSearch || null,
      });
      setResult(fresh);
    });
  }, [orgNumber, hasActiveSickLeave, debouncedSearch]);

  const handleLoadMore = useCallback(() => {
    if (!result.meta?.nextPageToken) return;
    const pageToken = result.meta.nextPageToken;
    startTransition(async () => {
      const next = await searchLinemanagersAction({
        orgNumber,
        hasActiveSickLeave,
        text: debouncedSearch || null,
        pageToken,
      });
      setResult((prev) => ({
        ...next,
        linemanagers: [...prev.linemanagers, ...next.linemanagers],
      }));
    });
  }, [
    result.meta?.nextPageToken,
    orgNumber,
    hasActiveSickLeave,
    debouncedSearch,
  ]);

  return (
    <VStack gap="space-32">
      {result.status === "error" ? (
        <LocalAlert
          status="error"
          data-testid={UiSelector.LinemanagerFeilAlert}
        >
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
                {hasActiveSickLeave
                  ? "Oversikt over ansatte med aktiv sykmelding"
                  : "Oversikt over ansatte uten aktiv sykmelding"}
              </LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
              {hasActiveSickLeave
                ? "Her ser du ansatte som har registrert nærmeste leder. Du kan endre eller bytte leder, og bryte koblingen mellom ansatt og leder, fra «Handlinger»."
                : "Her ser du ansatte som har registrert nærmeste leder. Du kan bryte koblingen mellom ansatt og leder fra «Handlinger»."}
            </LocalAlert.Content>
          </LocalAlert>

          <TextField
            label="Søk på navn eller fødselsnummer"
            size="medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid={UiSelector.LinemanagerSok}
            autoComplete="off"
          />

          <LinemanagerTabell
            linemanagers={result.linemanagers}
            loading={isPending}
          />

          {result.meta?.hasMore && (
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              loading={isPending}
              data-testid={UiSelector.LinemanagerLastFlere}
            >
              Last flere
            </Button>
          )}
        </>
      )}
    </VStack>
  );
}
