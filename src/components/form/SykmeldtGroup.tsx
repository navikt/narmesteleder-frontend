import { withFieldGroup } from '@/components/form/hooks/form'
import { sykmeldtFormDefaults } from '@/schemas/nærmestelederFormSchema'

export const SykmeldtGroup = withFieldGroup({
  defaultValues: sykmeldtFormDefaults,
  render: function Sykmeldt({ group }) {
    return (
      <>
        <group.AppField name="fodselsnummer">
          {(field) => <field.TextInputField label="Fødselsnummer (11 sifre)" />}
        </group.AppField>
        <group.AppField name="orgnummer">
          {(field) => <field.TextInputField label="Orgnummer (8 sifre)" />}
        </group.AppField>
      </>
    )
  },
})
