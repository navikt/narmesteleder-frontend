"use client";

import { Button, HStack, VStack } from "@navikt/ds-react";
import { getSafeReturnTo } from "@/app/(registrering)/utils/returnTo";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import { ReplacementForm } from "./ReplacementForm";

export function EditView({
  initialData,
  returnTo,
  onSuccess,
}: {
  initialData: NarmesteLederInfo;
  returnTo?: string;
  onSuccess: (data: NarmesteLederInfo) => void;
}) {
  const returnToUrl = getSafeReturnTo(returnTo);

  return (
    <VStack gap="space-32">
      <HeadingLeder readOnlyVirksomhet tittel="Bytt nærmeste leder" />
      <ReplacementForm initialData={initialData} onSuccess={onSuccess} />
      {returnToUrl ? (
        <HStack>
          <Button as="a" href={returnToUrl} variant="secondary" size="small">
            Tilbake til oversikt
          </Button>
        </HStack>
      ) : null}
    </VStack>
  );
}
