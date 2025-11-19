import { FormSummary, VStack } from "@navikt/ds-react";
import { useSykmeldtAndLederContextState } from "@/context/sykmeldtAndLederContextState";
import { formatFnr } from "@/utils/formatting";

export function SykmeldtAndLederSummary() {
  const { submittedData, handleEdit } = useSykmeldtAndLederContextState();

  return (
    <FormSummary>
      <FormSummary.Header>
        <VStack gap="2">
          <p>Nærmeste leder for sykmeldt person med fødselsnummer</p>
          <FormSummary.Heading level="3">
            {formatFnr(submittedData.sykmeldt.fodselsnummer)}
          </FormSummary.Heading>
        </VStack>
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
