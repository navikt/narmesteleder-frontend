import { Bleed, Box } from "@navikt/ds-react";
import { Banner } from "@navikt/virksomhetsvelger";
import { HeadingVirksomhetsvelgerContent } from "@/shared/components/HeadingVirksomhetsvelger";
import { UiSelector } from "@/utils/uiSelectors";

export function HeadingLeder({
  readOnlyVirksomhet = false,
  tittel = "Oppgi nærmeste leder",
}: {
  readOnlyVirksomhet?: boolean;
  tittel?: string;
}) {
  return (
    <Box as="section" data-testid={UiSelector.HeadingLeder}>
      <Bleed marginInline="full">
        <Banner tittel={tittel}>
          <HeadingVirksomhetsvelgerContent readOnly={readOnlyVirksomhet} />
        </Banner>
      </Bleed>
    </Box>
  );
}
