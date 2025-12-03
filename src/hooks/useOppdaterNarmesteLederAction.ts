import { startTransition, useActionState } from "react";
import { NarmesteLederForm } from "@/schemas/nærmestelederFormSchema";
import { oppdaterNarmesteLeder } from "@/server/actions/oppdaterNarmesteLeder";

type OppdaterState = {
  error: string | null;
};

type OppdaterInput = {
  requirementId: string;
  values: NarmesteLederForm;
  onSuccess?: () => void;
  onSettled?: (state: OppdaterState) => void;
};

const initialOppdaterState: OppdaterState = { error: null };

const innerOppdaterAction = async (
  _previousState: OppdaterState,
  action: OppdaterInput,
): Promise<OppdaterState> => {
  const result = await oppdaterNarmesteLeder(
    action.requirementId,
    action.values,
  );

  let nextState: OppdaterState;

  if (result.success) {
    action.onSuccess?.();
    nextState = { error: null };
  } else {
    nextState = { error: result.translatedErrorMessage };
  }

  action.onSettled?.(nextState);
  return nextState;
};

export const useOppdaterNarmesteLederAction = () => {
  const [{ error }, oppdaterAction, isPending] = useActionState(
    innerOppdaterAction,
    initialOppdaterState,
  );

  const startOppdaterNarmesteLeder = (
    requirementId: string,
    values: NarmesteLederForm,
    options?: { onSuccess?: () => void },
  ): Promise<OppdaterState> =>
    // Provide a promise so forms can keep `isSubmitting` in sync with the action lifecycle.
    new Promise((resolve) => {
      startTransition(() =>
        oppdaterAction({
          requirementId,
          values,
          onSuccess: options?.onSuccess,
          onSettled: resolve,
        }),
      );
    });

  return {
    startOppdaterNarmesteLeder,
    isPending,
    error,
  } as const;
};
