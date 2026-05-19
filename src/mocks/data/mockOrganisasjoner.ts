import type { Organisasjon } from "@navikt/virksomhetsvelger";

export const mockOrganisasjoner = [
  {
    orgnr: "811076732",
    navn: "Havna Holding AS",
    underenheter: [
      {
        orgnr: "963890095",
        navn: "Shark AS",
        underenheter: [],
      },
      {
        orgnr: "912345678",
        navn: "Whale AS",
        underenheter: [],
      },
    ],
  },
  {
    orgnr: "987654321",
    navn: "Nordlys Gruppen AS",
    underenheter: [
      {
        orgnr: "876543219",
        navn: "Aurora Consulting AS",
        underenheter: [],
      },
    ],
  },
] satisfies Organisasjon[];
