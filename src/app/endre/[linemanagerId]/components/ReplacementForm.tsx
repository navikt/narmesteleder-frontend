"use client";

import {
  BodyShort,
  Box,
  Heading,
  HStack,
  Label,
  VStack,
} from "@navikt/ds-react";
import { revalidateLogic } from "@tanstack/react-form";
import { useRegistreringAction } from "@/app/(registrering)/hooks/useRegistreringAction";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { narmesteLederInfoSchema } from "@/schemas/nærmestelederFormSchema";
import ErrorAlert from "@/shared/components/ErrorAlert";
import { useAppForm } from "@/shared/components/form/hooks/form";
import { LederGroup } from "@/shared/components/form/LederGroup";
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
          <Box padding="space-16" background="accent-soft" borderRadius="8">
            <VStack gap="space-16">
              <Heading level="2" size="medium">
                Sykmeldt
              </Heading>
              <VStack gap="space-4">
                <Label>Etternavn</Label>
                <BodyShort>{initialData.sykmeldt.etternavn}</BodyShort>
              </VStack>
              <VStack gap="space-4">
                <Label>Fødselsnummer</Label>
                <BodyShort>{initialData.sykmeldt.fodselsnummer}</BodyShort>
              </VStack>
              <VStack gap="space-4">
                <Label>Organisasjonsnummer</Label>
                <BodyShort>{initialData.sykmeldt.orgnummer}</BodyShort>
              </VStack>
            </VStack>
          </Box>
          <Box padding="space-16" background="accent-soft" borderRadius="8">
            <VStack gap="space-24" className="w-full max-w-md">
              <Heading level="2" size="medium">
                Ny nærmeste leder
              </Heading>
              <LederGroup form={form} fields="leder" />
            </VStack>
          </Box>
          <BodyShort>
            Når du sender inn, erstatter den nye nærmeste lederen den nåværende
            koblingen. Opplysningene kontrolleres på nytt av Nav.
          </BodyShort>
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
