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
  // Husker hvilken virksomhet listen gjelder, slik at Strict Modes ekstra effektkjøring ikke henter den på nytt.
  const loadedOrgNumber = useRef<string | null>(enabled ? orgNumber : null);

  useEffect(() => {
    setResult(initialResult);
  }, [initialResult]);

  useEffect(() => {
    if (!enabled) {
      loadedOrgNumber.current = null;
      return;
    }

    if (loadedOrgNumber.current === orgNumber) {
      return;
    }
    loadedOrgNumber.current = orgNumber;

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
