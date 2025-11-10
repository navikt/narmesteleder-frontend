import { withFieldGroup } from "@/components/form/hooks/form";
import { narmesteLederFormDefaults } from "@/schemas/nærmestelederFormSchema";

export const LederGroup = withFieldGroup({
  defaultValues: narmesteLederFormDefaults,
  render: function Leder({ group }) {
    return (
      <>
        <group.AppField name="fodselsnummer">
          {(field) => <field.TextInputField label="Fødselsnummer (11 sifre)" />}
        </group.AppField>
        <group.AppField name="fornavn">
          {(field) => <field.TextInputField label="Fornavn" />}
        </group.AppField>
        <group.AppField name="etternavn">
          {(field) => <field.TextInputField label="Etternavn" />}
        </group.AppField>
        <group.AppField name="epost">
          {(field) => <field.TextInputField label="E-post" />}
        </group.AppField>
        <group.AppField name="mobilnummer">
          {(field) => <field.TextInputField label="Mobilnummer" />}
        </group.AppField>
      </>
    );
  },
});
