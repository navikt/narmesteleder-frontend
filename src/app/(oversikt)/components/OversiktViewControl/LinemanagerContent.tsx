"use client";

import {
  BodyLong,
  Button,
  Heading,
  LocalAlert,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import type { FetchLinemanagerSearchResult } from "@/server/fetchData/fetchLinemanagerSearch";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { UiSelector } from "@/utils/uiSelectors";
import { revokeLinemanagerAction } from "../../actions/revokeLinemanager";
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

function getRowKey(item: LinemanagerSearchItem): string {
  return `${item.orgNumber}-${item.employee.nationalIdentificationNumber}-${item.manager.nationalIdentificationNumber}`;
}

export function LinemanagerContent({
  orgNumber,
  hasActiveSickLeave,
}: LinemanagerContentProps) {
  const [result, setResult] =
    useState<FetchLinemanagerSearchResult>(emptyResult);
  const [search, setSearch] = useState("");
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [revokingKey, setRevokingKey] = useState<string | null>(null);
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
      setRevokeError(null);
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

  const handleRevoke = useCallback((item: LinemanagerSearchItem) => {
    const lastName = item.employee.name?.lastName;
    if (!lastName) {
      setRevokeError(
        "Vi kan ikke bryte koblingen fordi etternavn mangler for den ansatte.",
      );
      return;
    }

    const rowKey = getRowKey(item);
    setRevokeError(null);

    startTransition(async () => {
      setRevokingKey(rowKey);
      try {
        const revokeResult = await revokeLinemanagerAction({
          employeeIdentificationNumber:
            item.employee.nationalIdentificationNumber,
          orgNumber: item.orgNumber,
          lastName,
        });

        if (!revokeResult.success) {
          setRevokeError(
            revokeResult.errorDetail.message ||
              "Vi klarte ikke å bryte koblingen. Prøv igjen senere.",
          );
          return;
        }

        setResult((prev) => {
          const nextLinemanagers = prev.linemanagers.filter(
            (candidate) => getRowKey(candidate) !== rowKey,
          );

          return {
            ...prev,
            status: nextLinemanagers.length > 0 ? "available" : "empty",
            linemanagers: nextLinemanagers,
            meta: prev.meta
              ? {
                  ...prev.meta,
                  size: Math.max(0, prev.meta.size - 1),
                }
              : null,
          };
        });
      } catch {
        setRevokeError("Vi klarte ikke å bryte koblingen. Prøv igjen senere.");
      } finally {
        setRevokingKey(null);
      }
    });
  }, []);

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
          <Heading level="2" size="small">
            {hasActiveSickLeave
              ? "Ansatte med aktiv sykmelding"
              : "Ansatte uten aktiv sykmelding"}
          </Heading>
          <BodyLong>
            Her ser du ansatte som har registrert nærmeste leder. Du kan bryte
            koblingen mellom ansatt og leder fra «Handlinger». Du kan deretter
            registrere ny leder fra fanen «Mangler leder».
          </BodyLong>

          {revokeError && (
            <LocalAlert
              status="error"
              data-testid={UiSelector.LinemanagerFeilAlert}
            >
              <LocalAlert.Header>
                <LocalAlert.Title>Kunne ikke bryte koblingen</LocalAlert.Title>
              </LocalAlert.Header>
              <LocalAlert.Content>{revokeError}</LocalAlert.Content>
            </LocalAlert>
          )}

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
            revokingKey={revokingKey}
            onRevoke={handleRevoke}
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
