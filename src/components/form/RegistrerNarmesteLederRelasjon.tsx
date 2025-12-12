"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { BoxNew, HStack, Heading, VStack } from "@navikt/ds-react";
import ErrorAlert from "@/components/ErrorAlert";
import { LederGroup } from "@/components/form/LederGroup";
import { SykmeldtGroup } from "@/components/form/SykmeldtGroup";
import { useAppForm } from "@/components/form/hooks/form";
import { useSykmeldtAndLederContextState } from "@/context/sykmeldtAndLederContextState";
import { useOpprettNarmesteLederAction } from "@/hooks/useOpprettNarmesteLederAction";
import { narmesteLederInfoSchema } from "@/schemas/nærmestelederFormSchema";
import { TestId } from "@/utils/testIds";

export default function RegistrerNarmesteLederRelasjon() {
  const { submittedData, handleSuccess } = useSykmeldtAndLederContextState();
  const { startOpprettNarmesteLeder, error: error } =
    useOpprettNarmesteLederAction();

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
        data-testid={TestId.RegistrerNarmesteLederRelasjonForm}
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }}
      >
        <form.AppForm>
          <VStack gap="space-32">
            <BoxNew
              padding="space-16"
              background="accent-soft"
              borderRadius="8"
            >
              <VStack gap="space-24" className="w-full max-w-md">
                <Heading className="mt-2" size="medium" level="2">
                  Sykmeldt
                </Heading>
                <SykmeldtGroup form={form} fields="sykmeldt" />
              </VStack>
            </BoxNew>
            <BoxNew
              padding="space-16"
              background="accent-soft"
              borderRadius="8"
            >
              <VStack gap="space-24" className="w-full max-w-md">
                <Heading className="mt-2" size="medium" level="2">
                  Nærmeste leder
                </Heading>
                <LederGroup form={form} fields="leder" />
              </VStack>
            </BoxNew>
            {error && <ErrorAlert detail={error} />}
            <HStack className="mt-0">
              <form.BoundSubmitButton
                label="Send inn"
                testId={TestId.SendInn}
              />
            </HStack>
          </VStack>
        </form.AppForm>
      </form>
    </VStack>
  );
}
