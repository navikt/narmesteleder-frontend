import { Bleed, Box, Heading, HStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
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
        <Box
          background="default"
          borderColor="neutral-subtle"
          borderWidth="0 0 1"
          paddingBlock={{ xs: "space-16", md: "space-20" }}
        >
          <PageBlock width="xl" gutters>
            <HStack align="center" gap="space-16" justify="space-between" wrap>
              <Heading level="1" size="xlarge">
                {tittel}
              </Heading>
              <HeadingVirksomhetsvelgerContent readOnly={readOnlyVirksomhet} />
            </HStack>
          </PageBlock>
        </Box>
      </Bleed>
    </Box>
  );
}
