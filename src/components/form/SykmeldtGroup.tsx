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
              maxLength={11}
              minLength={11}
            />
          )}
        </group.AppField>
        <group.AppField name="orgnummer">
          {(field) => (
            <field.TextInputField
              label="Organisasjonsnummer (9 sifre)"
              maxLength={9}
              minLength={9}
            />
          )}
        </group.AppField>
      </>
    );
  },
});
