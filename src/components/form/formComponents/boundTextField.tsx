import { TextField, TextFieldProps } from "@navikt/ds-react";
import { useFieldContext } from "@/components/form/hooks/form-context";

export type BoundTextFieldProps = {
  label: string;
  type?: TextFieldProps["type"];
};

export function BoundTextField({
  label,

  type,
}: BoundTextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <TextField
      label={label}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={field.state.meta.errors[0]?.message}
      type={type}
    />
  );
}
