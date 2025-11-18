import { FormSummary } from "@navikt/ds-react";
import { useSykmeldtLederFlow } from "@/context/sykmeldtLederFlowContext";
import { formatFnr } from "@/utils/formatting";

export function SykmeldtLederSummary() {
  const { submittedData, handleEdit } = useSykmeldtLederFlow();

  return (
    <FormSummary>
      <FormSummary.Header>
        <FormSummary.Heading level="3">
          Nærmeste leder for fødselsnummer{" "}
          {submittedData.sykmeldt.fodselsnummer}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            Fødselsnummer til nærmeste leder
          </FormSummary.Label>
          <FormSummary.Value>
            {formatFnr(submittedData.leder.fodselsnummer)}
          </FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>Epost</FormSummary.Label>
          <FormSummary.Value>{submittedData.leder.epost}</FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>Mobilnummer</FormSummary.Label>
          <FormSummary.Value>
            {submittedData.leder.mobilnummer}
          </FormSummary.Value>
        </FormSummary.Answer>
      </FormSummary.Answers>
      <FormSummary.Footer>
        <FormSummary.EditLink
          onClick={handleEdit}
          style={{ cursor: "pointer" }}
        />
      </FormSummary.Footer>
    </FormSummary>
  );
}
