import { LocalAlert } from "@navikt/ds-react";
import { UiSelector } from "@/utils/uiSelectors";

export default function ThankYouAlert() {
  return (
    <LocalAlert status="success" data-testid={UiSelector.ThankYouAlert}>
      <LocalAlert.Header>
        <LocalAlert.Title>Nærmeste leder er registrert</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        Takk, du har sendt inn svarene dine til Nav.
      </LocalAlert.Content>
    </LocalAlert>
  );
}
