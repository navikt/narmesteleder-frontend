"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { NarmesteLederForm } from "@/schemas/nærmestelederFormSchema";
import { ErrorDetail } from "@/server/narmesteLederErrorUtils";

const DEFAULT_ERROR: ErrorDetail = {
  title: "Beklager! Det har oppstått en uventet feil",
  message: "Vi klarte ikke å gjennomføre handlingen. Prøv igjen senere.",
};

/**
 * Mock hook for useOppdaterNarmesteLederAction.
 * Control behavior via URL query param: ?simulateError=true
 *
 * SAFETY: This mock is only used in local/demo environments (via mockableHook).
 * In production, the real hook is used and this code is never executed.
 */
export const useMockOppdaterNarmesteLederAction = () => {
  const searchParams = useSearchParams();
  const shouldSimulateError = searchParams.get("simulateError") === "true";

  const [error, setError] = useState<ErrorDetail | null>(null);
  const [isPending, setIsPending] = useState(false);

  const startOppdaterNarmesteLeder = async (
    _behovId: string,
    _values: NarmesteLederForm,
    options?: { onSuccess?: () => void },
  ) => {
    setIsPending(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsPending(false);

    if (shouldSimulateError) {
      setError(DEFAULT_ERROR);
    } else {
      options?.onSuccess?.();
    }
  };

  return { startOppdaterNarmesteLeder, isPending, error } as const;
};
