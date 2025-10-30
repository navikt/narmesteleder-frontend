import { withForm } from '@/components/form/hooks/form'
import { Fieldset } from '@navikt/ds-react'
import { narmestelederFormOptions } from '@/components/form/form-Options'

export const SykmeldtSubform = withForm({
  ...narmestelederFormOptions,
  render: ({ form }) => {
    return (
      <Fieldset legend="Sykmeldt" className="space-y-4">
        <form.AppField name="sykmeldt.fodselsnummer">
          {(field) => <field.TextInputField label="Fødselsnummer (11 sifre)" />}
        </form.AppField>
        <form.AppField name="sykmeldt.orgnummer">
          {(field) => <field.TextInputField label="Orgnummer (8 sifre)" />}
        </form.AppField>
      </Fieldset>
    )
  },
})
