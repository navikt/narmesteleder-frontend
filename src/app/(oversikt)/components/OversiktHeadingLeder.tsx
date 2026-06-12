import { Bleed, Box, Heading, HGrid } from "@navikt/ds-react";
import { HeadingVirksomhetsvelgerContent } from "@/shared/components/HeadingVirksomhetsvelger";
import { UiSelector } from "@/utils/uiSelectors";

/**
 * Oversikt-spesifikk variant av Banner-headingen.
 *
 * Bruker HGrid i stedet for Banner-komponentens interne flex-wrap-layout,
 * slik at tittelen og virksomhetsvelgeren vises side om side på brede skjermer.
 * Banner-komponentens CSS har hashed klasser og flex-wrap: wrap som gjør at
 * innholdHeader (≈30rem) + widgets (≈30rem) + 48px gap overstiger container-max
 * (60rem), og dermed alltid wrapper på desktop.
 *
 * Replikerer Banner visuelt:
 * - background: default
 * - border-bottom: 1px solid neutral-subtle
 * - padding: 16px (xs), 20px/16px (md+)
 * - innhold sentrert, maks 60rem bred
 */
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
            columns={{ xs: 1, md: "1fr auto" }}
            gap={{ xs: "space-16", md: "space-48" }}
            align="center"
            style={{ maxWidth: "60rem", marginInline: "auto" }}
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
