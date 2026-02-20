"use client";
import { HStack, VStack } from "@navikt/ds-react";
import type { ErrorDetail } from "@/server/narmesteLederErrorUtils";
import { ButtonMinSideArbeidsgiver } from "@/shared/components/ButtonMinSideArbeidsgiver";
import ErrorAlert from "@/shared/components/ErrorAlert";
import { HeadingLeder } from "@/shared/components/HeadingLeder";

interface InfoErrorProps {
  detail: ErrorDetail;
}

export default function InfoError({ detail }: InfoErrorProps) {
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
