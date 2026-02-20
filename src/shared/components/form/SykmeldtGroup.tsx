import { sykmeldtFormDefaults } from "@/schemas/nærmestelederFormSchema";
import { withFieldGroup } from "@/shared/components/form/hooks/form";
import { UiSelector } from "@/utils/uiSelectors";

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
              uiSelector={UiSelector.SykmeldtFodselsnummer}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="etternavn">
          {(field) => (
            <field.TextInputField
              label="Etternavn"
              uiSelector={UiSelector.SykmeldtEtternavn}
              isRequired
            />
          )}
        </group.AppField>
        <group.AppField name="orgnummer">
          {(field) => (
            <field.TextInputField
              label="Organisasjonsnummer (9 siffer)"
              className="w-66"
              uiSelector={UiSelector.Organisasjonsnummer}
              isRequired
            />
          )}
        </group.AppField>
      </>
    );
  },
});
