# Runtime-feilkontrakt v1.0.0

Byte-identisk kopi av [Team eSyfos schema v1.0.0](https://navikt.github.io/team-esyfo/contracts/runtime-error/v1.0.0/schema.json).
Kildekode: [navikt/team-esyfo](https://github.com/navikt/team-esyfo/blob/9d85123/docs/public/contracts/runtime-error/v1.0.0/schema.json).

Kopien valideres med Ajv 8.20.0 som ren testavhengighet. De faktisk serialiserte
loggene fra `tokenXFetch.runtimeErrorSerialization.test.ts` valideres før lokale
hendelses-, kode-, trace- og personvernkrav kontrolleres. Dette kjører i vanlig
`pnpm test --run`, også i eksisterende CI. Ingen schemafiler hentes under test.

`SHA256SUMS.txt` låser innholdet; testen sjekker summen. Ikke rediger eller
formater schemaet lokalt. En oppgradering gjøres ved å hente og reviewe en ny
versjon fra Team eSyfo og oppdatere testens versjonsreferanse.

Ny logging bruker fortsatt appens eksisterende logger og lukkede katalog i
`src/server/observability/runtimeErrorContract.ts`. Legg til et kontrollert
feilforløp i serialiseringstesten. Ikke filtrer bort logger uten `event_type`:
manglende identitet skal feile testen. Schemaet erstatter ikke testing av
loggnivå, én terminal logg, relevant diagnostikk og fravær av persondata.
