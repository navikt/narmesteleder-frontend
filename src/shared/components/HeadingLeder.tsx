import { Bleed, Box } from "@navikt/ds-react";
import { Banner } from "@navikt/virksomhetsvelger";
import { HeadingVirksomhetsvelgerContent } from "@/shared/components/HeadingVirksomhetsvelger";
import { UiSelector } from "@/utils/uiSelectors";

export function HeadingLeder({
  readOnlyVirksomhet = false,
}: {
  readOnlyVirksomhet?: boolean;
}) {
  return (
    <Box as="section" data-testid={UiSelector.HeadingLeder}>
      <Bleed marginInline="full">
        <Banner tittel="Oppgi nærmeste leder">
          <HeadingVirksomhetsvelgerContent readOnly={readOnlyVirksomhet} />
        </Banner>
      </Bleed>
    </Box>
  );
}
