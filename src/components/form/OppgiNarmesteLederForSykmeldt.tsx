"use client";

import { useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { HStack, Heading, VStack } from "@navikt/ds-react";
import ErrorAlert from "@/components/form/ErrorAlert";
import { LederGroup } from "@/components/form/LederGroup";
import { useAppForm } from "@/components/form/hooks/form";
import { useLederOnlyContextState } from "@/context/lederOnlyContextState";
import { lederOnlySchema } from "@/schemas/nærmestelederFormSchema";
import { oppdaterNarmesteLeder } from "@/server/actions/oppdaterNarmesteLeder";

export default function OppgiNarmesteLederForSykmeldt() {
  const [actionError, setActionError] = useState(false);
  const { submittedData, handleSuccess, behovId } = useLederOnlyContextState();

  const form = useAppForm({
    defaultValues: submittedData,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: lederOnlySchema },
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
      <VStack gap="4">
        <Heading level="2" size="small">
          Nærmeste leder
        </Heading>

        <form.AppForm>
          <VStack gap="4">
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
