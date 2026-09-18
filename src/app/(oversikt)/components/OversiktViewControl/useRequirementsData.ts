"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { FetchRequirementsListResult } from "@/server/fetchData/fetchRequirementsList";
import { searchRequirementsAction } from "../../actions/searchRequirements";

export function useRequirementsData({
  initialResult,
  orgNumber,
  enabled,
}: {
  initialResult: FetchRequirementsListResult;
  orgNumber: string;
  enabled: boolean;
}) {
  const [result, setResult] = useState(initialResult);
  const [isPending, startTransition] = useTransition();
  const skipInitialFetch = useRef(enabled);

  useEffect(() => {
    setResult(initialResult);
  }, [initialResult]);

  useEffect(() => {
    if (!enabled) {
      skipInitialFetch.current = false;
      return;
    }

    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    let cancelled = false;
    startTransition(async () => {
      const fresh = await searchRequirementsAction(orgNumber);
      if (!cancelled) {
        setResult(fresh);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, orgNumber]);

  return { result, isPending };
}
