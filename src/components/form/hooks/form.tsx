import { createFormHook } from "@tanstack/react-form";
import {
  fieldContext,
  formContext,
} from "@/components/form/hooks/form-context";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextInputField } from "@/components/form/TextInputField";

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInputField },
  formComponents: {
    BoundSubmitButton: SubmitButton,
  },
});
