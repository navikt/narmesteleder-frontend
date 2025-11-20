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
              label="Fødselsnummer (11 sifre)"
              className="w-60"
            />
          )}
        </group.AppField>
        <group.AppField name="orgnummer">
          {(field) => (
            <field.TextInputField
              label="Organisasjonsnummer (9 sifre)"
              className="w-60"
            />
          )}
        </group.AppField>
      </>
    );
  },
});
