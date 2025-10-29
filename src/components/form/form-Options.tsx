import { formOptions } from '@tanstack/form-core'
import { narmesteLederInfoDefaults } from '@/schemas/nærmestelederFormSchema'

export const narmestelederFormOptions = formOptions({
  defaultValues: narmesteLederInfoDefaults,
})
