"use client";
import { HStack, VStack } from "@navikt/ds-react";
import { ErrorDetail } from "@/server/narmesteLederErrorUtils";
import { ButtonMinSideArbeidsgiver } from "./ButtonMinSideArbeidsgiver";
import ErrorAlert from "./ErrorAlert";
import { HeadingLeder } from "./HeadingLeder";

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
