import { FormSummary, Heading, VStack } from "@navikt/ds-react";
import { useLederOnlyContextState } from "@/context/lederOnlyContextState";
import { formatFnr } from "@/utils/formatting";

export function LederOnlySummary() {
  const { submittedData, handleEdit, lederInfo } = useLederOnlyContextState();

  return (
    <FormSummary>
      <FormSummary.Header>
        <VStack gap="2">
          <FormSummary.Heading level="3">
            Nærmeste leder for
          </FormSummary.Heading>
          <Heading level="6" size="small">
            {`${lederInfo.sykmeldt.fullnavn} (fødselsnummer ${lederInfo.sykmeldtFnr})`}
          </Heading>
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
