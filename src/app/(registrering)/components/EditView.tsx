import { Button, HStack, VStack } from "@navikt/ds-react";
import { useRegistreringContextState } from "@/app/(registrering)/state/contextState";
import { publicEnv } from "@/env-variables/publicEnv";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import InfoPanel from "./InfoPanel";
import RegistreringForm from "./RegistreringForm";

function isSafeReturnTo(url: string): boolean {
  return url.startsWith(`${publicEnv.NEXT_PUBLIC_BASE_PATH}/`);
}

export function EditView() {
  const { returnTo } = useRegistreringContextState();
  const returnToUrl = returnTo && isSafeReturnTo(returnTo) ? returnTo : null;

  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <InfoPanel />
      {returnToUrl && (
        <HStack>
          <Button as="a" href={returnToUrl} variant="secondary" size="small">
            Tilbake til oversikt
          </Button>
        </HStack>
      )}
      <RegistreringForm />
    </VStack>
  );
}
