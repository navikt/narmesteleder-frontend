"use client";

import type { NarmesteLederForm } from "@/schemas/nærmestelederFormSchema";
import { useMockSubmitAction } from "./useMockSubmitAction";

export const useMockOppdaterNarmesteLederAction = () => {
  const { action, isPending, error } =
    useMockSubmitAction<[behovId: string, values: NarmesteLederForm]>();

  return { startOppdaterNarmesteLeder: action, isPending, error } as const;
};
