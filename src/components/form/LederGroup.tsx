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
              uiSelector={UiSelector.LederFodselsnummer}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="etternavn">
          {(field) => (
            <field.TextInputField
              label="Etternavn"
              uiSelector={UiSelector.LederEtternavn}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="epost">
          {(field) => (
            <field.TextInputField
              label="E-post"
              type="email"
              uiSelector={UiSelector.Epost}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="mobilnummer">
          {(field) => (
            <field.TextInputField
              label="Mobilnummer (8 siffer)"
              type="tel"
              uiSelector={UiSelector.Mobilnummer}
              className="w-48"
              isRequired
            />
          )}
        </group.AppField>
      </>
    );
  },
});
