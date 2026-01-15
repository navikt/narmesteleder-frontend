import { LocalAlert } from "@navikt/ds-react";
import type { ErrorDetail } from "@/server/narmesteLederErrorUtils";
import { TestId } from "@/utils/testIds";

type ErrorAlertProps = {
  detail?: ErrorDetail;
};

const DEFAULT_TITLE = "Beklager! Det har oppstått en uventet feil";
const DEFAULT_MESSAGE =
  "Vi klarte ikke å sende inn svarene dine. Prøv igjen om litt.";

export default function ErrorAlert({ detail }: ErrorAlertProps) {
  const title = detail?.title ?? DEFAULT_TITLE;
  const content = detail?.message ?? DEFAULT_MESSAGE;

  return (
    <LocalAlert status="error" data-testid={TestId.ErrorAlert}>
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>{content}</LocalAlert.Content>
    </LocalAlert>
  );
}
