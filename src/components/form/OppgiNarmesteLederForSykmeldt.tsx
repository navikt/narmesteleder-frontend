"use client";

import { useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { HStack, Heading, VStack } from "@navikt/ds-react";
import ErrorAlert from "@/components/form/ErrorAlert";
import { LederGroup } from "@/components/form/LederGroup";
import ThankYouAlert from "@/components/form/ThankYouAlert";
import { useAppForm } from "@/components/form/hooks/form";
import {
  lederOnlyDefaults,
  lederOnlySchema,
} from "@/schemas/nærmestelederFormSchema";
import { oppdaterNarmesteLeder } from "@/server/actions/oppdaterNarmesteLeder";

type props = {
  behovId: string;
};

export default function OppgiNarmesteLederForSykmeldt({ behovId }: props) {
  const [actionError, setActionError] = useState(false);
  const [isSubmittedForm, setIsSubmittedForm] = useState(false);

  const form = useAppForm({
    defaultValues: lederOnlyDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: lederOnlySchema },
    onSubmit: async ({ value }) => {
      const actionResult = await oppdaterNarmesteLeder(behovId, value.leder);
      if (!actionResult.success) {
        setActionError(true);
      } else {
        setIsSubmittedForm(true);
      }
    },
  });

  if (isSubmittedForm) {
    return <ThankYouAlert />;
  }

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
