import { Heading } from "@navikt/ds-react";
import { TestId } from "@/utils/testIds";

export function HeadingLeder() {
  return (
    <Heading size="large" level="1" data-testid={TestId.HeadingLeder}>
      Oppgi nærmeste leder
    </Heading>
  );
}
