import { Box, Heading, VStack } from "@navikt/ds-react";
import { HeadingVirksomhetsvelgerContent } from "@/shared/components/HeadingVirksomhetsvelger";
import { UiSelector } from "@/utils/uiSelectors";

export function HeadingLeder({
  readOnlyVirksomhet = false,
}: {
  readOnlyVirksomhet?: boolean;
}) {
  return (
    <Box as="section" data-testid={UiSelector.HeadingLeder}>
      <VStack gap="space-16">
        <Heading size="large" level="1">
          Oppgi nærmeste leder
        </Heading>
        <HeadingVirksomhetsvelgerContent readOnly={readOnlyVirksomhet} />
      </VStack>
    </Box>
  );
}
