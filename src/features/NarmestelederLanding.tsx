'use client'

import RegisterNarmestelederForm from '@/components/RegisterNarmestelederForm'

export type NarmestelederLandingProps = {
  backendPostResult: string
}

export default function NarmestelederLanding({ backendPostResult }: NarmestelederLandingProps) {
  return <RegisterNarmestelederForm></RegisterNarmestelederForm>
}
