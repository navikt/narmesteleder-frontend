import { startTransition, useActionState } from "react";
import { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { opprettNarmesteLeder } from "@/server/actions/opprettNarmesteLeder";

type OpprettState = {
  error: string | null;
};

type OpprettInput = {
  values: NarmesteLederInfo;
  onSuccess?: () => void;
  onSettled?: (state: OpprettState) => void;
};

const initialOpprettState: OpprettState = { error: null };

const innerOpprettAction = async (
  _previousState: OpprettState,
  action: OpprettInput,
): Promise<OpprettState> => {
  const result = await opprettNarmesteLeder(action.values);

  let nextState: OpprettState;

  if (result.success) {
    action.onSuccess?.();
    nextState = { error: null };
  } else {
    nextState = { error: result.translatedErrorMessage };
  }

  action.onSettled?.(nextState);
  return nextState;
};

export const useOpprettNarmesteLederAction = () => {
  const [{ error }, opprettAction, isPending] = useActionState(
    innerOpprettAction,
    initialOpprettState,
  );

  const startOpprettNarmesteLeder = (
    values: NarmesteLederInfo,
    options?: { onSuccess?: () => void },
  ): Promise<OpprettState> =>
    // Provide a promise so forms can keep `isSubmitting` in sync with the action lifecycle.
    new Promise((resolve) => {
      startTransition(() =>
        opprettAction({
          values,
          onSuccess: options?.onSuccess,
          onSettled: resolve,
        }),
      );
    });

  return {
    startOpprettNarmesteLeder,
    isPending,
    error,
  } as const;
};
