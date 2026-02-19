"use client";
import { HStack, VStack } from "@navikt/ds-react";
import { ButtonMinSideArbeidsgiver } from "@/components/ButtonMinSideArbeidsgiver";
import ErrorAlert from "@/components/ErrorAlert";
import { HeadingLeder } from "@/components/HeadingLeder";
import type { ErrorDetail } from "@/server/narmesteLederErrorUtils";

interface LederInfoErrorProps {
  detail: ErrorDetail;
}

export default function LederInfoError({ detail }: LederInfoErrorProps) {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <ErrorAlert detail={detail} />
      <HStack>
        <ButtonMinSideArbeidsgiver />
      </HStack>
    </VStack>
  );
}
