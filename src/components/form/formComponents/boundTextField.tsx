import { TextField } from '@navikt/ds-react'
import { useFieldContext } from '@/components/form/hooks/form'

export type TextFieldProps = {
  label: string
}

export function BoundTextField({ label }: TextFieldProps) {
  const field = useFieldContext<string>()
  return (
    <TextField
      label={label}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={field.state.meta.errors[0]?.message}
    />
  )
}
