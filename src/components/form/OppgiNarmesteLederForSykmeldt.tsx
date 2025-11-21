"use client";

import { useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { HStack, Heading, VStack } from "@navikt/ds-react";
import ErrorAlert from "@/components/form/ErrorAlert";
import { LederGroup } from "@/components/form/LederGroup";
import { useAppForm } from "@/components/form/hooks/form";
import { useLederContextState } from "@/context/lederContextState";
import { lederSchema } from "@/schemas/nærmestelederFormSchema";
import { oppdaterNarmesteLeder } from "@/server/actions/oppdaterNarmesteLeder";

export default function OppgiNarmesteLederForSykmeldt() {
  const [actionError, setActionError] = useState(false);
  const { submittedData, handleSuccess, behovId } = useLederContextState();

  const form = useAppForm({
    defaultValues: submittedData,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: lederSchema },
    onSubmit: async ({ value }) => {
      const actionResult = await oppdaterNarmesteLeder(behovId, value.leder);
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
      <VStack gap="space-16" className="w-full max-w-md">
        <Heading level="2" size="small">
          Nærmeste leder
        </Heading>

        <form.AppForm>
          <VStack gap="space-16">
            <LederGroup form={form} fields="leder" />
          </VStack>
        </form.AppForm>
        {actionError && <ErrorAlert />}
        <HStack className="mt-0">
          <form.AppForm>
            <form.BoundSubmitButton label="Send inn" />
          </form.AppForm>
        </HStack>
      </VStack>
    </form>
  );
}
