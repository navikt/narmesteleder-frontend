import { LocalAlert } from "@navikt/ds-react";

export default function ErrorAlert() {
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>
          Beklager! Det har oppstått en uventet feil
        </LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        Vi klarte ikke å sende inn svarene dine. Prøv igjen om litt.
      </LocalAlert.Content>
    </LocalAlert>
  );
}
