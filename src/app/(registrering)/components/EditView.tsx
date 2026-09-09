import { Button, HStack, VStack } from "@navikt/ds-react";
import { useRegistreringContextState } from "@/app/(registrering)/state/contextState";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import { getSafeReturnTo } from "@/utils/returnTo";
import InfoPanel from "./InfoPanel";
import RegistreringForm from "./RegistreringForm";

export function EditView() {
  const { returnTo } = useRegistreringContextState();
  const returnToUrl = getSafeReturnTo(returnTo);

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
