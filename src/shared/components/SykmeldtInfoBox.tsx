"use client";

import {
  BodyShort,
  Box,
  Heading,
  HStack,
  Label,
  VStack,
} from "@navikt/ds-react";

export interface SykmeldtInfoField {
  label: string;
  value: string;
}

export function SykmeldtInfoBox({
  fields,
  testId,
}: {
  fields: SykmeldtInfoField[];
  testId?: string;
}) {
  return (
    <Box
      padding="space-16"
      background="accent-soft"
      borderRadius="8"
      data-testid={testId}
    >
      <VStack gap="space-24">
        <Heading level="2" className="mt-2" size="medium">
          Sykmeldt
        </Heading>
        <HStack gap="space-32" wrap>
          {fields.map(({ label, value }) => (
            <VStack key={label} gap="space-16" className="min-w-32">
              <Label size="medium">{label}</Label>
              <BodyShort>{value}</BodyShort>
            </VStack>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
