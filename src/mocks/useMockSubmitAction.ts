"use client";

import { useState } from "react";
import type { ErrorDetail } from "@/server/narmesteLederErrorUtils";

export type SubmitMockScenario = "submit-error" | "slow-submit";

const DEFAULT_ERROR: ErrorDetail = {
  title: "Beklager! Det har oppstått en uventet feil",
  message: "Vi klarte ikke å gjennomføre handlingen. Prøv igjen senere.",
};

const getMockScenario = (): SubmitMockScenario | undefined => {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get("mockScenario") as SubmitMockScenario | undefined;
};

/**
 * Generic mock hook factory for submit actions.
 * Control behavior via URL query param: ?mockScenario=submit-error or ?mockScenario=slow-submit
 *
 * SAFETY: This mock is only used in local/demo environments.
 * In production, the real hook is used and this code is never executed.
 */
export const useMockSubmitAction = <TArgs extends unknown[]>() => {
  const [error, setError] = useState<ErrorDetail | null>(null);
  const [isPending, setIsPending] = useState(false);

  const action = async (
    ...args: [...TArgs, options?: { onSuccess?: () => void }]
  ) => {
    const options = args[args.length - 1] as
      | { onSuccess?: () => void }
      | undefined;

    setIsPending(true);
    setError(null);

    const mockScenario = getMockScenario();
    const delay = mockScenario === "slow-submit" ? 2000 : 600;
    await new Promise((resolve) => setTimeout(resolve, delay));

    setIsPending(false);

    if (mockScenario === "submit-error") {
      setError(DEFAULT_ERROR);
    } else {
      options?.onSuccess?.();
    }
  };

  return { action, isPending, error } as const;
};
