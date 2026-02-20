import { Button } from "@navikt/ds-react";
import NextLink from "next/link";
import { publicEnv } from "@/env-variables/publicEnv";
import { UiSelector } from "@/utils/uiSelectors";

export function ExitButton() {
  return (
    <Button
      data-testid={UiSelector.ExitButton}
      as={NextLink}
      href={publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL}
      variant="secondary"
    >
      Tilbake til Min side Arbeidsgiver
    </Button>
  );
}
