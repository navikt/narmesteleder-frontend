import { type ReactNode } from "react";
import { LocalAlert } from "@navikt/ds-react";

type ErrorAlertProps = {
  children?: ReactNode;
};

export default function ErrorAlert({ children }: ErrorAlertProps) {
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>
          Beklager! Det har oppstått en uventet feil
        </LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        {children ??
          "Vi klarte ikke å sende inn svarene dine. Prøv igjen om litt."}
      </LocalAlert.Content>
    </LocalAlert>
  );
}
