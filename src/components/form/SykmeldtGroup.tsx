import { withFieldGroup } from "@/components/form/hooks/form";
import { sykmeldtFormDefaults } from "@/schemas/nærmestelederFormSchema";

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
            />
          )}
        </group.AppField>
        <group.AppField name="etternavn">
          {(field) => <field.TextInputField label="Etternavn" />}
        </group.AppField>
        <group.AppField name="orgnummer">
          {(field) => (
            <field.TextInputField
              label="Organisasjonsnummer (9 siffer)"
              className="w-66"
            />
          )}
        </group.AppField>
      </>
    );
  },
});
