import { TextField, type TextFieldProps } from "@navikt/ds-react";
import { useFieldContext } from "@/shared/components/form/hooks/form-context";

export type TextInputFieldProps = {
  label: string;
  description?: TextFieldProps["description"];
  type?: TextFieldProps["type"];
  className?: string;
  uiSelector?: string;
  isRequired?: boolean;
  trim?: boolean;
};

export function TextInputField({
  label,
  description,
  type,
  className,
  uiSelector,
  isRequired = false,
  trim = false,
}: TextInputFieldProps) {
  const field = useFieldContext<string>();

  return (
    <TextField
      label={label}
      description={description}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={() => {
        if (trim) {
          field.handleChange(field.state.value.replace(/\s/g, ""));
        }
        field.handleBlur();
      }}
      error={field.state.meta.errors[0]?.message}
      type={type}
      className={className}
      data-testid={uiSelector ?? field.name}
      aria-required={isRequired}
    />
  );
}
