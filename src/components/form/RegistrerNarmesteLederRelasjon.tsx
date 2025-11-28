"use client";

import { useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { HStack, Heading, VStack } from "@navikt/ds-react";
import ErrorAlert from "@/components/ErrorAlert";
import { LederGroup } from "@/components/form/LederGroup";
import { SykmeldtGroup } from "@/components/form/SykmeldtGroup";
import { useAppForm } from "@/components/form/hooks/form";
import { useSykmeldtAndLederContextState } from "@/context/sykmeldtAndLederContextState";
import { narmesteLederInfoSchema } from "@/schemas/nærmestelederFormSchema";
import { opprettNarmesteLeder } from "@/server/actions/opprettNarmesteLeder";

export default function RegistrerNarmesteLederRelasjon() {
  const [actionError, setActionError] = useState(false);
  const { submittedData, handleSuccess } = useSykmeldtAndLederContextState();

  const form = useAppForm({
    defaultValues: submittedData,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: narmesteLederInfoSchema },
    onSubmit: async ({ value }) => {
      const actionResult = await opprettNarmesteLeder(value);
      if (!actionResult.success) {
        setActionError(true);
      } else {
        handleSuccess(value);
      }
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <form.AppForm>
        <VStack gap="space-32">
          <VStack gap="space-16">
            <Heading size="medium" level="2">
              Sykmeldt
            </Heading>
            <SykmeldtGroup form={form} fields="sykmeldt" />
          </VStack>

          <VStack gap="space-16">
            <Heading size="medium" level="2">
              Nærmeste leder
            </Heading>
            <LederGroup form={form} fields="leder" />
          </VStack>
          {actionError && <ErrorAlert />}
          <HStack className="mt-0">
            <form.BoundSubmitButton label="Send inn" />
          </HStack>
        </VStack>
      </form.AppForm>
    </form>
  );
}
