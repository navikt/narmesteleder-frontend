import { LocalAlert } from "@navikt/ds-react";
import { TestId } from "@/utils/testIds";

export default function ThankYouAlert() {
  return (
    <LocalAlert status="success" data-testid={TestId.ThankYouAlert}>
      <LocalAlert.Header>
        <LocalAlert.Title>Nærmeste leder er registrert</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        Takk, du har sendt inn svarene dine til Nav.
      </LocalAlert.Content>
    </LocalAlert>
  );
}
