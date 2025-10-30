import { Alert, Heading } from '@navikt/ds-react'

export async function AlertError() {
  return (
    <Alert className="mb-8 w-2xl" variant="error" role="alert">
      <Heading size="small" level="2">
        Beklager! Det har oppstått en uventet feil
      </Heading>
      Vi klarte ikke å sende inn svarene dine. Prøv igjen om litt.
    </Alert>
  )
}
