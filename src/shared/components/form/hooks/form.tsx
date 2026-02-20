import { createFormHook } from "@tanstack/react-form";
import {
  fieldContext,
  formContext,
} from "@/shared/components/form/hooks/form-context";
import { SubmitButton } from "@/shared/components/form/SubmitButton";
import { TextInputField } from "@/shared/components/form/TextInputField";

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInputField },
  formComponents: {
    BoundSubmitButton: SubmitButton,
  },
});
