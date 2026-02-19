"use client";

import { Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { revalidateLogic } from "@tanstack/react-form";
import ErrorAlert from "@/components/ErrorAlert";
import { useAppForm } from "@/components/form/hooks/form";
import { LederGroup } from "@/components/form/LederGroup";
import { useLederContextState } from "@/context/lederContextState";
import { useOppdaterNarmesteLederAction } from "@/hooks/useOppdaterNarmesteLederAction";
import { lederSchema } from "@/schemas/nærmestelederFormSchema";
import { TestId } from "@/utils/testIds";

export default function BehovForm() {
  const { submittedData, handleSuccess, behovId } = useLederContextState();
  const { error, startOppdaterNarmesteLeder } =
    useOppdaterNarmesteLederAction();

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
      data-testid={TestId.OppiNarmesteLederForSykmeldt}
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
                  testId={TestId.SendInn}
                />
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </form.AppForm>
    </form>
  );
}
