import { withFieldGroup } from "@/components/form/hooks/form";
import { narmesteLederFormDefaults } from "@/schemas/nærmestelederFormSchema";
import { TestId } from "@/utils/testIds";

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
              testId={TestId.LederFodselsnummer}
            />
          )}
        </group.AppField>
        <group.AppField name="etternavn">
          {(field) => (
            <field.TextInputField
              label="Etternavn"
              testId={TestId.LederEtternavn}
            />
          )}
        </group.AppField>
        <group.AppField name="epost">
          {(field) => (
            <field.TextInputField
              label="E-post"
              type="email"
              testId={TestId.Epost}
            />
          )}
        </group.AppField>
        <group.AppField name="mobilnummer">
          {(field) => (
            <field.TextInputField
              label="Mobilnummer (8 siffer)"
              type="tel"
              testId={TestId.Mobilnummer}
              className="w-48"
            />
          )}
        </group.AppField>
      </>
    );
  },
});
