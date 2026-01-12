import { withFieldGroup } from "@/components/form/hooks/form";
import { sykmeldtFormDefaults } from "@/schemas/nærmestelederFormSchema";
import { TestId } from "@/utils/testIds";

export const SykmeldtGroup = withFieldGroup({
  defaultValues: sykmeldtFormDefaults,
  render: function Sykmeldt({ group }) {
    return (
      <>
        <group.AppField name="fodselsnummer">
          {(field) => (
            <field.TextInputField
              label="Fødselsnummer (11 siffer)"
              className="w-66"
              testId={TestId.SykmeldtFodselsnummer}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="etternavn">
          {(field) => (
            <field.TextInputField
              label="Etternavn"
              testId={TestId.SykmeldtEtternavn}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="orgnummer">
          {(field) => (
            <field.TextInputField
              label="Organisasjonsnummer (9 siffer)"
              className="w-66"
              testId={TestId.Organisasjonsnummer}
              isRequired
            />
          )}
        </group.AppField>
      </>
    );
  },
});
