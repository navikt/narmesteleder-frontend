import { createFormHook } from "@tanstack/react-form";
import { SubmitButton } from "@/components/form/components/SubmitButton";
import { TextInputField } from "@/components/form/components/TextInputField";
import {
  fieldContext,
  formContext,
} from "@/components/form/hooks/form-context";

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInputField },
  formComponents: {
    BoundSubmitButton: SubmitButton,
  },
});
