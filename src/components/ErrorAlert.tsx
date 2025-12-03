import { type ReactNode } from "react";
import { LocalAlert } from "@navikt/ds-react";
import { type ErrorDetail } from "@/server/narmesteLederErrorUtils";

type ErrorAlertProps = {
  detail?: ErrorDetail;
};

const DEFAULT_TITLE = "Beklager! Det har oppstått en uventet feil";
const DEFAULT_MESSAGE =
  "Vi klarte ikke å sende inn svarene dine. Prøv igjen om litt.";

export default function ErrorAlert({ detail }: ErrorAlertProps) {
  const title = detail?.title ?? DEFAULT_TITLE;
  const content = detail?.message ?? DEFAULT_MESSAGE;

type ErrorAlertProps = {
  children?: ReactNode;
};

export default function ErrorAlert({ children }: ErrorAlertProps) {
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        {children ??
          "Vi klarte ikke å sende inn svarene dine. Prøv igjen om litt."}
      </LocalAlert.Content>
    </LocalAlert>
  );
}
