"use client";

import { Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { revalidateLogic } from "@tanstack/react-form";
import { useBehovAction } from "@/app/(behov)/[behovId]/hooks/useBehovAction";
import { useBehovContextState } from "@/app/(behov)/[behovId]/state/contextState";
import { lederSchema } from "@/schemas/nærmestelederFormSchema";
import ErrorAlert from "@/shared/components/ErrorAlert";
import { useAppForm } from "@/shared/components/form/hooks/form";
import { LederGroup } from "@/shared/components/form/LederGroup";
import { UiSelector } from "@/utils/uiSelectors";

export default function BehovForm() {
  const { submittedData, handleSuccess, behovId } = useBehovContextState();
  const { error, startOppdaterNarmesteLeder } = useBehovAction();

  const form = useAppForm({
    defaultValues: submittedData,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: lederSchema },
    onSubmit: ({ value }) =>
      startOppdaterNarmesteLeder(behovId, value.leder, {
        onSuccess() {
          handleSuccess(value);
        },
      }),
  });

  return (
    <form
      data-testid={UiSelector.BehovForm}
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <form.AppForm>
        <VStack gap="space-32">
          <Box padding="space-16" background="accent-soft" borderRadius="8">
            <VStack gap="space-24" className="w-full max-w-md">
              <Heading className="mt-2" level="2" size="medium">
                Nærmeste leder
              </Heading>
              <LederGroup form={form} fields="leder" />
              {error && <ErrorAlert detail={error} />}
              <HStack className="mt-0">
                <form.BoundSubmitButton
                  label="Send inn"
                  uiSelector={UiSelector.SendInn}
                />
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </form.AppForm>
    </form>
  );
}
