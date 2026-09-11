"use client";

import { Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { revalidateLogic } from "@tanstack/react-form";
import { useRegistreringAction } from "@/app/(registrering)/hooks/useRegistreringAction";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { narmesteLederInfoSchema } from "@/schemas/nærmestelederFormSchema";
import ErrorAlert from "@/shared/components/ErrorAlert";
import { useAppForm } from "@/shared/components/form/hooks/form";
import { LederGroup } from "@/shared/components/form/LederGroup";
import { SykmeldtInfoBox } from "@/shared/components/SykmeldtInfoBox";
import { UiSelector } from "@/utils/uiSelectors";

export function ReplacementForm({
  initialData,
  onSuccess,
}: {
  initialData: NarmesteLederInfo;
  onSuccess: (data: NarmesteLederInfo) => void;
}) {
  const { startOpprettNarmesteLeder, error } = useRegistreringAction();
  const form = useAppForm({
    defaultValues: initialData,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: narmesteLederInfoSchema },
    onSubmit: ({ value }) =>
      startOpprettNarmesteLeder(value, {
        onSuccess() {
          onSuccess(value);
        },
      }),
  });

  return (
    <form
      data-testid={UiSelector.ReplacementForm}
      onSubmit={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <form.AppForm>
        <VStack gap="space-32">
          <SykmeldtInfoBox
            fields={[
              { label: "Etternavn", value: initialData.sykmeldt.etternavn },
              {
                label: "Fødselsnummer",
                value: initialData.sykmeldt.fodselsnummer,
              },
            ]}
          />
          <Box padding="space-16" background="accent-soft" borderRadius="8">
            <VStack gap="space-24" className="w-full max-w-md">
              <Heading level="2" size="medium">
                Ny nærmeste leder
              </Heading>
              <LederGroup form={form} fields="leder" />
            </VStack>
          </Box>
          {error ? <ErrorAlert detail={error} /> : null}
          <HStack>
            <form.BoundSubmitButton
              label="Bytt nærmeste leder"
              uiSelector={UiSelector.SendInn}
            />
          </HStack>
        </VStack>
      </form.AppForm>
    </form>
  );
}
