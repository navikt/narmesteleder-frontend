import { startTransition, useActionState } from "react";
import { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { opprettNarmesteLeder } from "@/server/actions/opprettNarmesteLeder";
import { ErrorDetail } from "@/server/narmesteLederErrors";

const initialState = { error: null as ErrorDetail | null };

const action = async (
  _prev: typeof initialState,
  {
    values,
    onSuccess,
    onSettled,
  }: {
    values: NarmesteLederInfo;
    onSuccess?: () => void;
    onSettled?: (state: typeof initialState) => void;
  },
) => {
  const result = await opprettNarmesteLeder(values);
  const nextState = { error: result.success ? null : result.errorDetail };
  if (result.success) onSuccess?.();
  onSettled?.(nextState);
  return nextState;
};

export const useOpprettNarmesteLederAction = () => {
  const [{ error }, runAction, isPending] = useActionState(
    action,
    initialState,
  );

  const startOpprettNarmesteLeder = (
    values: NarmesteLederInfo,
    options?: { onSuccess?: () => void },
  ) =>
    new Promise((resolve) => {
      startTransition(() =>
        runAction({
          values,
          onSuccess: options?.onSuccess,
          onSettled: resolve,
        }),
      );
    });

  return { startOpprettNarmesteLeder, isPending, error } as const;
};
