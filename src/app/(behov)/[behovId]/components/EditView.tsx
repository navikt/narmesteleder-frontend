import { Button, HStack, VStack } from "@navikt/ds-react";
import { useBehovContextState } from "@/app/(behov)/[behovId]/state/contextState";
import { HeadingLeder } from "@/shared/components/HeadingLeder";
import { getSafeReturnTo } from "@/utils/returnTo";
import BehovForm from "./BehovForm";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";

export function EditView() {
  const { returnTo } = useBehovContextState();
  const returnToUrl = getSafeReturnTo(returnTo);

  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <OppgiLederPanel />
      {returnToUrl && (
        <HStack>
          <Button as="a" href={returnToUrl} variant="secondary" size="small">
            Tilbake til oversikt
          </Button>
        </HStack>
      )}
      <SykmeldtBox />
      <BehovForm />
    </VStack>
  );
}
