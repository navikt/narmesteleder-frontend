import { withForm } from '@/components/form/hooks/form'
import { narmestelederFormOptions } from '@/components/form/form-Options'
import { Fieldset } from '@navikt/ds-react'

export const NarmestelederSubform = withForm({
  ...narmestelederFormOptions,
  render: ({ form }) => {
    return (
      <Fieldset legend="Nærmeste leder" className="space-y-4">
        <form.AppField name="leder.fodselsnummer">
          {(field) => <field.TextInputField label="Fødselsnummer (11 sifre)" />}
        </form.AppField>

        <form.AppField name="leder.fornavn">{(field) => <field.TextInputField label="Fornavn" />}</form.AppField>

        <form.AppField name="leder.etternavn">{(field) => <field.TextInputField label="Etternavn" />}</form.AppField>

        <form.AppField name="leder.mobilnummer">
          {(field) => <field.TextInputField label="Mobilnummer" />}
        </form.AppField>

        <form.AppField name="leder.epost">{(field) => <field.TextInputField label="E-postadresse" />}</form.AppField>
      </Fieldset>
    )
  },
})
