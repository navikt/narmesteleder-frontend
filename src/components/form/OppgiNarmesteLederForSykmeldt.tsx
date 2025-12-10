"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { HStack, Heading, VStack } from "@navikt/ds-react";
import ErrorAlert from "@/components/ErrorAlert";
import { LederGroup } from "@/components/form/LederGroup";
import { useAppForm } from "@/components/form/hooks/form";
import { useLederContextState } from "@/context/lederContextState";
import { useOppdaterNarmesteLederAction } from "@/hooks/useOppdaterNarmesteLederAction";
import { lederSchema } from "@/schemas/nærmestelederFormSchema";

export default function OppgiNarmesteLederForSykmeldt() {
  const { submittedData, handleSuccess, behovId } = useLederContextState();
  const { error: error, startOppdaterNarmesteLeder } =
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
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <VStack gap="space-32" className="w-full max-w-md">
        <Heading className="mt-4" level="2" size="small">
          Nærmeste leder
        </Heading>

        <form.AppForm>
          <VStack gap="space-16">
            <LederGroup form={form} fields="leder" />
          </VStack>
        </form.AppForm>
        {error && <ErrorAlert detail={error} />}
        <HStack className="mt-0">
          <form.AppForm>
            <form.BoundSubmitButton label="Send inn" />
          </form.AppForm>
        </HStack>
      </VStack>
    </form>
  );
}
