import { Bleed, Box, Heading, HGrid } from "@navikt/ds-react";
import { HeadingVirksomhetsvelgerContent } from "@/shared/components/HeadingVirksomhetsvelger";
import { UiSelector } from "@/utils/uiSelectors";

export function OversiktHeadingLeder({
  readOnlyVirksomhet = false,
}: {
  readOnlyVirksomhet?: boolean;
}) {
  return (
    <Box as="section" data-testid={UiSelector.HeadingLeder}>
      <Bleed marginInline="full">
        <Box
          background="default"
          borderWidth="0 0 1 0"
          borderColor="neutral-subtle"
          paddingBlock={{ xs: "space-16", md: "space-20" }}
          paddingInline="space-16"
        >
          <HGrid
            columns={{ xs: 1, xl: "1fr auto" }}
            gap={{ xs: "space-16", xl: "space-48" }}
            align="center"
            style={{ maxWidth: "80rem", marginInline: "auto" }}
          >
            <Heading size="xlarge" level="1">
              Oversikt over nærmeste leder
            </Heading>
            <HeadingVirksomhetsvelgerContent readOnly={readOnlyVirksomhet} />
          </HGrid>
        </Box>
      </Bleed>
    </Box>
  );
}
