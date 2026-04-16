"use client";

import { BodyShort, Box, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { formatOrgNr, Virksomhetsvelger } from "@navikt/virksomhetsvelger";
import { useCallback, useEffect, useId, useRef } from "react";
import {
  getHeadingVirksomhetsvelgerAriaDescribedBy,
  shouldHandleFieldBlur,
} from "@/shared/components/HeadingVirksomhetsvelger.logic";
import { useOptionalVirksomhetContext } from "@/shared/state/virksomhetContext";
import { UiSelector } from "@/utils/uiSelectors";

const placeholderOrgnr = "000000000";

export function HeadingVirksomhetsvelger() {
  return <HeadingVirksomhetsvelgerContent />;
}

export function HeadingVirksomhetsvelgerContent({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const virksomhet = useOptionalVirksomhetContext();
  const virksomhetsvelgerRef = useRef<HTMLDivElement>(null);
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const triggerId = `${fieldId}-trigger`;
  const hasBlurredSinceFocusRef = useRef(false);

  const markSelectorInteracted = useCallback(() => {
    if (!shouldHandleFieldBlur(hasBlurredSinceFocusRef.current)) {
      return;
    }

    hasBlurredSinceFocusRef.current = true;
    virksomhet?.markSelectorInteracted();
  }, [virksomhet]);

  useEffect(() => {
    const root = virksomhetsvelgerRef.current;
    const trigger = root?.querySelector<HTMLButtonElement>(
      'button[aria-haspopup="true"]',
    );

    if (!root || !trigger || !virksomhet?.showSelector || readOnly) {
      return;
    }

    const onFocusIn = () => {
      hasBlurredSinceFocusRef.current = false;
    };

    const onFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && root.contains(nextTarget)) {
        return;
      }

      if (trigger.getAttribute("aria-expanded") === "true") {
        return;
      }

      markSelectorInteracted();
    };

    let wasExpanded = trigger.getAttribute("aria-expanded") === "true";
    const expandedObserver = new MutationObserver(() => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      if (!isExpanded && wasExpanded) {
        markSelectorInteracted();
      }

      wasExpanded = isExpanded;
    });

    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    expandedObserver.observe(trigger, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });

    return () => {
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      expandedObserver.disconnect();
    };
  }, [markSelectorInteracted, readOnly, virksomhet?.showSelector]);

  useEffect(() => {
    const trigger =
      virksomhetsvelgerRef.current?.querySelector<HTMLButtonElement>(
        'button[aria-haspopup="true"]',
      );

    if (!trigger || !virksomhet?.showSelector || readOnly) {
      return;
    }

    trigger.id = triggerId;
    trigger.removeAttribute("aria-labelledby");
    trigger.setAttribute(
      "aria-describedby",
      getHeadingVirksomhetsvelgerAriaDescribedBy({
        labelId,
        descriptionId,
        errorId,
        hasDescription: Boolean(virksomhet.description),
        hasError: Boolean(virksomhet.validationError),
      }),
    );

    if (virksomhet.isRequired) {
      trigger.setAttribute("aria-required", "true");
    } else {
      trigger.removeAttribute("aria-required");
    }

    if (virksomhet.validationError) {
      trigger.setAttribute("aria-errormessage", errorId);
      trigger.setAttribute("aria-invalid", "true");
    } else {
      trigger.removeAttribute("aria-errormessage");
      trigger.removeAttribute("aria-invalid");
    }
  }, [
    descriptionId,
    errorId,
    labelId,
    triggerId,
    virksomhet?.description,
    virksomhet?.isRequired,
    readOnly,
    virksomhet?.showSelector,
    virksomhet?.validationError,
  ]);

  if (!virksomhet?.hasVirksomhetContent) {
    return null;
  }

  return (
    <Box
      background="accent-soft"
      borderRadius="8"
      data-testid={UiSelector.HeadingVirksomhet}
      paddingBlock="space-16"
      paddingInline="space-16"
    >
      {virksomhet.showSelector && !readOnly ? (
        <VStack gap="space-8">
          <Label id={labelId} htmlFor={triggerId}>
            {virksomhet.label}
            {virksomhet.isRequired ? (
              <>
                <span aria-hidden="true"> *</span>
                <BodyShort as="span" visuallyHidden>
                  obligatorisk
                </BodyShort>
              </>
            ) : null}
          </Label>
          {virksomhet.description ? (
            <BodyShort id={descriptionId}>{virksomhet.description}</BodyShort>
          ) : null}
          <div
            ref={virksomhetsvelgerRef}
            data-testid={UiSelector.Organisasjonsnummer}
          >
            <Virksomhetsvelger
              organisasjoner={virksomhet.organisasjoner}
              initValgtOrgnr={virksomhet.orgnummer || undefined}
              friKomponent
              onChange={(organisasjon) => {
                if (organisasjon.orgnr === placeholderOrgnr) {
                  virksomhet.updateVirksomhet({
                    orgnummer: "",
                    orgnavn: "",
                  });
                  return;
                }

                virksomhet.updateVirksomhet({
                  orgnummer: organisasjon.orgnr,
                  orgnavn: organisasjon.navn,
                });
              }}
            />
          </div>
          {virksomhet.validationError ? (
            <ErrorMessage id={errorId}>
              {virksomhet.validationError}
            </ErrorMessage>
          ) : null}
        </VStack>
      ) : (
        <VStack gap="space-4">
          <BodyShort weight="semibold">{virksomhet.label}</BodyShort>
          <BodyShort>
            {virksomhet.orgnavn
              ? `${virksomhet.orgnavn}${
                  virksomhet.orgnummer
                    ? ` (${formatOrgNr(virksomhet.orgnummer) ?? virksomhet.orgnummer})`
                    : ""
                }`
              : (formatOrgNr(virksomhet.orgnummer ?? "") ??
                virksomhet.orgnummer)}
          </BodyShort>
        </VStack>
      )}
    </Box>
  );
}
