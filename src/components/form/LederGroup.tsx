import { withFieldGroup } from "@/components/form/hooks/form";
import { narmesteLederFormDefaults } from "@/schemas/nærmestelederFormSchema";
import { UiSelector } from "@/utils/uiSelectors";

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
              testId={UiSelector.LederFodselsnummer}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="etternavn">
          {(field) => (
            <field.TextInputField
              label="Etternavn"
              testId={UiSelector.LederEtternavn}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="epost">
          {(field) => (
            <field.TextInputField
              label="E-post"
              type="email"
              testId={UiSelector.Epost}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="mobilnummer">
          {(field) => (
            <field.TextInputField
              label="Mobilnummer (8 siffer)"
              type="tel"
              testId={UiSelector.Mobilnummer}
              className="w-48"
              isRequired
            />
          )}
        </group.AppField>
      </>
    );
  },
});
