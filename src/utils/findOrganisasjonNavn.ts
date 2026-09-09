import type { Organisasjon } from "@navikt/virksomhetsvelger";

export function findOrganisasjonNavn(
  orgnummer: string,
  organisasjoner: Organisasjon[],
): string {
  for (const organisasjon of organisasjoner) {
    if (organisasjon.orgnr === orgnummer) {
      return organisasjon.navn;
    }

    const orgnavn = findOrganisasjonNavn(orgnummer, organisasjon.underenheter);
    if (orgnavn) {
      return orgnavn;
    }
  }

  return "";
}
