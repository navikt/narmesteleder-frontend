// export useFieldContext for use in your custom components
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { TextInputField } from '@/components/formComponents/TextField'

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInputField },
  formComponents: {},
})
