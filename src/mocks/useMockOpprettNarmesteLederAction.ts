"use client";

import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { useMockSubmitAction } from "./useMockSubmitAction";

export const useMockOpprettNarmesteLederAction = () => {
  const { action, isPending, error } =
    useMockSubmitAction<[values: NarmesteLederInfo]>();

  return { startOpprettNarmesteLeder: action, isPending, error } as const;
};
