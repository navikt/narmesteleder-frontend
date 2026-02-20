import { TextField, type TextFieldProps } from "@navikt/ds-react";
import { useFieldContext } from "@/shared/components/form/hooks/form-context";

export type TextInputFieldProps = {
  label: string;
  type?: TextFieldProps["type"];
  className?: string;
  uiSelector?: string;
  isRequired?: boolean;
};

export function TextInputField({
  label,
  type,
  className,
  uiSelector,
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
      data-testid={uiSelector ?? field.name}
      aria-required={isRequired}
    />
  );
}
