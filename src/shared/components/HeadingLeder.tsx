import { Heading } from "@navikt/ds-react";
import { UiSelector } from "@/utils/uiSelectors";

export function HeadingLeder() {
  return (
    <Heading size="large" level="1" data-testid={UiSelector.HeadingLeder}>
      Oppgi nærmeste leder
    </Heading>
  );
}
