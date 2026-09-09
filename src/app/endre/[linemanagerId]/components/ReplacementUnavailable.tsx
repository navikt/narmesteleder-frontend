import { Button, LocalAlert, VStack } from "@navikt/ds-react";
import { getSafeReturnTo } from "@/utils/returnTo";

export function ReplacementUnavailable() {
  const overviewUrl = getSafeReturnTo("/oversikt");

  return (
    <VStack gap="space-24">
      <LocalAlert status="announcement">
        <LocalAlert.Header>
          <LocalAlert.Title>Kan ikke endre nærmeste leder</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          Koblingen er ikke tilgjengelig lenger.
        </LocalAlert.Content>
      </LocalAlert>
      {overviewUrl ? (
        <Button as="a" href={overviewUrl} variant="secondary" size="small">
          Tilbake til oversikt
        </Button>
      ) : null}
    </VStack>
  );
}
