import { Alert, Heading } from "@navikt/ds-react";

export default function ThankYouAlert() {
  return (
    <Alert variant="success">
      <Heading size="small" level="2">
        Takk, du har sendt inn svarene dine til Nav.
      </Heading>
    </Alert>
  );
}
