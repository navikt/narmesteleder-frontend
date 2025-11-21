import { FormSummary, VStack } from "@navikt/ds-react";
import { useSykmeldtAndLederContextState } from "@/context/sykmeldtAndLederContextState";
import { formatFnr } from "@/utils/formatting";

export function SykmeldtAndLederSummary() {
  const { submittedData, handleEdit } = useSykmeldtAndLederContextState();

  return (
    <VStack gap="space-32">
      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">Sykmeldt</FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>Fødselsnummer</FormSummary.Label>
            <FormSummary.Value>
              {formatFnr(submittedData.sykmeldt.fodselsnummer)}
            </FormSummary.Value>
          </FormSummary.Answer>
          <FormSummary.Answer>
            <FormSummary.Label>Organisasjonsnummer</FormSummary.Label>
            <FormSummary.Value>
              {submittedData.sykmeldt.orgnummer}
            </FormSummary.Value>
          </FormSummary.Answer>
        </FormSummary.Answers>
        <FormSummary.Footer>
          <FormSummary.EditLink
            onClick={handleEdit}
            className="cursor-pointer"
          />
        </FormSummary.Footer>
      </FormSummary>
      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">Nærmeste leder</FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>Fødselsnummer</FormSummary.Label>
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
            className="cursor-pointer"
          />
        </FormSummary.Footer>
      </FormSummary>
    </VStack>
  );
}
