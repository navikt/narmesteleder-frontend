import { TextField, type TextFieldProps } from "@navikt/ds-react";
import { useFieldContext } from "@/components/form/hooks/form-context";

export type TextInputFieldProps = {
  label: string;
  type?: TextFieldProps["type"];
  className?: string;
  testId?: string;
  isRequired?: boolean;
};

export function TextInputField({
  label,
  type,
  className,
  testId,
  isRequired = false,
}: TextInputFieldProps) {
  const field = useFieldContext<string>();

  return (
    <TextField
      label={label}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={field.state.meta.errors[0]?.message}
      type={type}
      className={className}
      data-testid={testId ?? field.name}
      aria-required={isRequired}
    />
  );
}
