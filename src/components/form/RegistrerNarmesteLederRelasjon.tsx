"use client";

import { useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { HStack, Heading, VStack } from "@navikt/ds-react";
import ErrorAlert from "@/components/form/ErrorAlert";
import { LederGroup } from "@/components/form/LederGroup";
import { SykmeldtGroup } from "@/components/form/SykmeldtGroup";
import ThankYouAlert from "@/components/form/ThankYouAlert";
import { useAppForm } from "@/components/form/hooks/form";
import {
  narmesteLederInfoDefaults,
  narmesteLederInfoSchema,
} from "@/schemas/nærmestelederFormSchema";
import { opprettNarmesteLeder } from "@/server/actions/opprettNarmesteLeder";

export default function RegistrerNarmesteLederRelasjon() {
  const [actionError, setActionError] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState(false);

  const form = useAppForm({
    defaultValues: narmesteLederInfoDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: narmesteLederInfoSchema },
    onSubmit: async ({ value }) => {
      const actionResult = await opprettNarmesteLeder(value);
      if (!actionResult.success) {
        setActionError(true);
      } else {
        setSubmittedFormData(true);
      }
    },
  });

  if (submittedFormData) {
    return <ThankYouAlert />;
  }

  return (
    <VStack gap="6">
      <Heading size="large" level="1">
        Oppgi nærmeste leder
      </Heading>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }}
      >
        <form.AppForm>
          <VStack gap="6">
            <VStack gap="4">
              <Heading size="medium" level="2">
                Sykmeldt
              </Heading>
              <SykmeldtGroup form={form} fields="sykmeldt" />
            </VStack>

            <VStack gap="4">
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
    </VStack>
  );
}
