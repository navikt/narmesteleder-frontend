import { createFormHook } from '@tanstack/react-form'
import { BoundTextField } from '@/components/form/formComponents/boundTextField'
import { BoundSubmitButton } from '@/components/form/formComponents/boundSubmitButton'
import { fieldContext, formContext } from '@/components/form/hooks/form-context'

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInputField: BoundTextField },
  formComponents: {
    BoundSubmitButton,
  },
})
