"use client";

import { Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { revalidateLogic } from "@tanstack/react-form";
import { useRegistreringAction } from "@/app/(registrering)/hooks/useRegistreringAction";
import { useRegistreringContextState } from "@/app/(registrering)/state/contextState";
import ErrorAlert from "@/components/ErrorAlert";
import { useAppForm } from "@/components/form/hooks/form";
import { LederGroup } from "@/components/form/LederGroup";
import { SykmeldtGroup } from "@/components/form/SykmeldtGroup";
import { narmesteLederInfoSchema } from "@/schemas/nærmestelederFormSchema";
import { UiSelector } from "@/utils/uiSelectors";

export default function RegistreringForm() {
  const { submittedData, handleSuccess } = useRegistreringContextState();
  const { startOpprettNarmesteLeder, error } = useRegistreringAction();

  const form = useAppForm({
    defaultValues: submittedData,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: narmesteLederInfoSchema },
    onSubmit: ({ value }) =>
      startOpprettNarmesteLeder(value, {
        onSuccess() {
          handleSuccess(value);
        },
      }),
  });

  return (
    <VStack gap="space-24">
      <form
        data-testid={UiSelector.RegistreringForm}
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
                <Heading className="mt-2" size="medium" level="2">
                  Sykmeldt
                </Heading>
                <SykmeldtGroup form={form} fields="sykmeldt" />
              </VStack>
            </Box>
            <Box padding="space-16" background="accent-soft" borderRadius="8">
              <VStack gap="space-24" className="w-full max-w-md">
                <Heading className="mt-2" size="medium" level="2">
                  Nærmeste leder
                </Heading>
                <LederGroup form={form} fields="leder" />
              </VStack>
            </Box>
            {error && <ErrorAlert detail={error} />}
            <HStack className="mt-0">
              <form.BoundSubmitButton
                label="Send inn"
                testId={UiSelector.SendInn}
              />
            </HStack>
          </VStack>
        </form.AppForm>
      </form>
    </VStack>
  );
}
