import { Button } from "@navikt/ds-react";
import { publicEnv } from "@/env-variables/publicEnv";

export function ButtonMinSideArbeidsgiver({
  text = "Gå til Min side arbeidsgiver",
}: {
  text?: string;
}) {
  return (
    <Button
      as="a"
      href={publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL}
      variant="primary"
    >
      {text}
    </Button>
  );
}
