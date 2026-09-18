"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import type { FetchLinemanagerSearchResult } from "@/server/fetchData/fetchLinemanagerSearch";
import { revokeLinemanagerAction } from "../../actions/revokeLinemanager";
import { searchLinemanagersAction } from "../../actions/searchLinemanagers";

const emptyResult: FetchLinemanagerSearchResult = {
  status: "empty",
  linemanagers: [],
  meta: null,
};

function getRowKey(item: LinemanagerSearchItem): string {
  return item.linemanagerId;
}

export function useLinemanagerData({
  orgNumber,
  hasActiveSickLeave,
  search,
}: {
  orgNumber: string;
  hasActiveSickLeave: boolean | null;
  search: string;
}) {
  const [result, setResult] =
    useState<FetchLinemanagerSearchResult>(emptyResult);
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [revokeSuccess, setRevokeSuccess] = useState<string | null>(null);
  const [revokingKey, setRevokingKey] = useState<string | null>(null);
  const [pendingRevoke, setPendingRevoke] =
    useState<LinemanagerSearchItem | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (hasActiveSickLeave === null) {
      setResult(emptyResult);
      setRevokeError(null);
      setRevokeSuccess(null);
      setPendingRevoke(null);
      return;
    }

    let cancelled = false;
    setResult(emptyResult);

    startTransition(async () => {
      const fresh = await searchLinemanagersAction({
        orgNumber,
        hasActiveSickLeave,
        text: search || null,
      });

      if (!cancelled) {
        setRevokeError(null);
        setRevokeSuccess(null);
        setResult(fresh);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [orgNumber, hasActiveSickLeave, search]);

  const handleLoadMore = useCallback(() => {
    if (hasActiveSickLeave === null || !result.meta?.nextPageToken) {
      return;
    }

    const pageToken = result.meta.nextPageToken;
    startTransition(async () => {
      const next = await searchLinemanagersAction({
        orgNumber,
        hasActiveSickLeave,
        text: search || null,
        pageToken,
      });
      setResult((previous) => ({
        ...next,
        linemanagers: [...previous.linemanagers, ...next.linemanagers],
      }));
    });
  }, [result.meta?.nextPageToken, orgNumber, hasActiveSickLeave, search]);

  const executeRevoke = useCallback(
    (item: LinemanagerSearchItem) => {
      const lastName = item.employee.name?.lastName;
      if (!lastName) {
        setPendingRevoke(null);
        setRevokeError(
          "Vi kan ikke bryte koblingen fordi etternavn mangler for den ansatte.",
        );
        return;
      }

      const rowKey = getRowKey(item);
      setRevokeError(null);
      setRevokeSuccess(null);

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

          setResult((previous) => {
            const linemanagers = previous.linemanagers.filter(
              (candidate) => getRowKey(candidate) !== rowKey,
            );

            return {
              ...previous,
              status: linemanagers.length > 0 ? "available" : "empty",
              linemanagers,
            };
          });

          if (hasActiveSickLeave === false) {
            setRevokeSuccess(
              "Nærmeste leder er fjernet. Den ansatte vises ikke lenger i oversikten.",
            );
          }
        } catch {
          setRevokeError(
            "Vi klarte ikke å bryte koblingen. Prøv igjen senere.",
          );
        } finally {
          setPendingRevoke(null);
          setRevokingKey(null);
        }
      });
    },
    [hasActiveSickLeave],
  );

  const handleRevoke = useCallback((item: LinemanagerSearchItem) => {
    setRevokeError(null);
    setRevokeSuccess(null);
    setPendingRevoke(item);
  }, []);

  return {
    result,
    isPending,
    revokingKey,
    revokeError,
    revokeSuccess,
    pendingRevoke,
    handleLoadMore,
    handleRevoke,
    confirmRevoke: () => {
      if (pendingRevoke) {
        executeRevoke(pendingRevoke);
      }
    },
    closeRevokeDialog: () => {
      if (!isPending) {
        setPendingRevoke(null);
      }
    },
  };
}
