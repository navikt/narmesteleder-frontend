import NextLink from "next/link";
import { Button } from "@navikt/ds-react";
import { publicEnv } from "@/env-variables/publicEnv";

export function ExitButton() {
  return (
    <Button
      as={NextLink}
      href={publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL}
      variant="secondary"
    >
      Tilbake til Min side Arbeidsgiver
    </Button>
  );
}
