import { withFieldGroup } from "@/components/form/hooks/form";
import { narmesteLederFormDefaults } from "@/schemas/nærmestelederFormSchema";

export const LederGroup = withFieldGroup({
  defaultValues: narmesteLederFormDefaults,
  render: function Leder({ group }) {
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
        <group.AppField name="epost">
          {(field) => <field.TextInputField label="E-post" type="email" />}
        </group.AppField>
        <group.AppField name="mobilnummer">
          {(field) => (
            <field.TextInputField
              label="Mobilnummer (8 siffer)"
              type="tel"
              className="w-48"
            />
          )}
        </group.AppField>
      </>
    );
  },
});
