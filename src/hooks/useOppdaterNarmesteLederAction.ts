import { startTransition, useActionState } from "react";
import { useMockOppdaterNarmesteLederAction } from "@/mocks/useMockOppdaterNarmesteLederAction";
import { NarmesteLederForm } from "@/schemas/nærmestelederFormSchema";
import { oppdaterNarmesteLeder } from "@/server/actions/oppdaterNarmesteLeder";
import { ErrorDetail } from "@/server/narmesteLederErrorUtils";
import { mockableHook } from "@/utils/mockableHook";

const initialState = { error: null as ErrorDetail | null };

const action = async (
  _prev: typeof initialState,
  {
    behovId,
    values,
    onSuccess,
    onSettled,
  }: {
    behovId: string;
    values: NarmesteLederForm;
    onSuccess?: () => void;
    onSettled?: (state: typeof initialState) => void;
  },
) => {
  const result = await oppdaterNarmesteLeder(behovId, values);
  const nextState = { error: result.success ? null : result.errorDetail };
  if (result.success) onSuccess?.();
  onSettled?.(nextState);
  return nextState;
};

const useRealOppdaterNarmesteLederAction = () => {
  const [{ error }, runAction, isPending] = useActionState(
    action,
    initialState,
  );

  const startOppdaterNarmesteLeder = (
    behovId: string,
    values: NarmesteLederForm,
    options?: { onSuccess?: () => void },
  ) =>
    new Promise((resolve) => {
      startTransition(() =>
        runAction({
          behovId,
          values,
          onSuccess: options?.onSuccess,
          onSettled: resolve,
        }),
      );
    });

  return { startOppdaterNarmesteLeder, isPending, error } as const;
};

export const useOppdaterNarmesteLederAction = mockableHook({
  real: useRealOppdaterNarmesteLederAction,
  mock: useMockOppdaterNarmesteLederAction,
});
