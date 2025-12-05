import { startTransition, useActionState } from "react";
import { NarmesteLederForm } from "@/schemas/nærmestelederFormSchema";
import { oppdaterNarmesteLeder } from "@/server/actions/oppdaterNarmesteLeder";
import { ErrorDetail } from "@/server/narmesteLederErrorUtils";

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

export const useOppdaterNarmesteLederAction = () => {
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
