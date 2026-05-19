"use client";

import { Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { revalidateLogic } from "@tanstack/react-form";
import { useEffect } from "react";
import {
  getOrgnummerValidationError,
  shouldMarkOrgnummerTouchedFromHeadingSelector,
} from "@/app/(registrering)/components/RegistreringForm.logic";
import { useRegistreringAction } from "@/app/(registrering)/hooks/useRegistreringAction";
import { useRegistreringContextState } from "@/app/(registrering)/state/contextState";
import { narmesteLederInfoSchema } from "@/schemas/nærmestelederFormSchema";
import ErrorAlert from "@/shared/components/ErrorAlert";
import { useAppForm } from "@/shared/components/form/hooks/form";
import { LederGroup } from "@/shared/components/form/LederGroup";
import { SykmeldtGroup } from "@/shared/components/form/SykmeldtGroup";
import { useOptionalVirksomhetContext } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";

function VirksomhetValidationSync({
  validationError,
  setValidationError,
}: {
  validationError?: string;
  setValidationError: (error?: string) => void;
}) {
  useEffect(() => {
    setValidationError(validationError);

    return () => {
      setValidationError(undefined);
    };
  }, [setValidationError, validationError]);

  return null;
}

export default function RegistreringForm() {
  const { submittedData, handleSuccess } = useRegistreringContextState();
  const { startOpprettNarmesteLeder, error } = useRegistreringAction();
  const headingVirksomhet = useOptionalVirksomhetContext();

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

  useEffect(() => {
    if (!headingVirksomhet?.showSelector) {
      return;
    }

    form.setFieldValue("sykmeldt.orgnummer", headingVirksomhet.orgnummer ?? "");
  }, [form, headingVirksomhet?.orgnummer, headingVirksomhet?.showSelector]);

  useEffect(() => {
    if (
      !shouldMarkOrgnummerTouchedFromHeadingSelector({
        showSelector: headingVirksomhet?.showSelector ?? false,
        selectorInteractionCount:
          headingVirksomhet?.selectorInteractionCount ?? 0,
      })
    ) {
      return;
    }

    form.setFieldMeta("sykmeldt.orgnummer", (meta) => ({
      ...meta,
      isTouched: true,
      isBlurred: true,
    }));
  }, [
    form,
    headingVirksomhet?.selectorInteractionCount,
    headingVirksomhet?.showSelector,
  ]);

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
            {headingVirksomhet?.showSelector ? (
              <form.Subscribe
                selector={(state) => {
                  const orgnummerMeta = state.fieldMeta["sykmeldt.orgnummer"];
                  return getOrgnummerValidationError({
                    submissionAttempts: state.submissionAttempts,
                    isTouched: orgnummerMeta?.isTouched ?? false,
                    errorMessage: orgnummerMeta?.errors[0]?.message,
                  });
                }}
              >
                {(validationError) => (
                  <VirksomhetValidationSync
                    validationError={validationError}
                    setValidationError={headingVirksomhet.setValidationError}
                  />
                )}
              </form.Subscribe>
            ) : null}
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
                uiSelector={UiSelector.SendInn}
              />
            </HStack>
          </VStack>
        </form.AppForm>
      </form>
    </VStack>
  );
}
