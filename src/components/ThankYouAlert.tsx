import { LocalAlert } from "@navikt/ds-react";

export default function ThankYouAlert() {
  return (
    <LocalAlert status="success">
      <LocalAlert.Header>
        <LocalAlert.Title>Nærmeste leder er registrert</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        Takk, du har sendt inn svarene dine til Nav.
      </LocalAlert.Content>
    </LocalAlert>
  );
}
