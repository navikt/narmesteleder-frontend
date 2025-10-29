import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { BoundTextField } from '@/components/form/formComponents/boundTextField'

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInputField: BoundTextField },
  formComponents: {},
})
