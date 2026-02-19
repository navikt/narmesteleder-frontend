import { VStack } from "@navikt/ds-react";
import { HeadingLeder } from "@/components/HeadingLeder";
import BehovForm from "./BehovForm";
import OppgiLederPanel from "./OppgiLederPanel";
import SykmeldtBox from "./SykmeldtBox";

export function EditView() {
  return (
    <VStack gap="space-32">
      <HeadingLeder />
      <OppgiLederPanel />
      <SykmeldtBox />
      <BehovForm />
    </VStack>
  );
}
