# Nærmesteleder frontendapp

[![Build Status](https://github.com/navikt/narmesteleder-frontend/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/navikt/narmesteleder-frontend/actions/workflows/build-and-deploy.yaml)

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

## Miljøer

🚀 [Produksjon](https://www.nav.no/arbeidsgiver/ansatte/narmesteleder)

🛠️ [Utvikling](https://www.ekstern.dev.nav.no/arbeidsgiver/ansatte/narmesteleder)

🎬 [Demo - skjema for sykmeldt og nærmeste leder](https://demo.ekstern.dev.nav.no/arbeidsgiver/ansatte/narmesteleder)

🎬 [Demo - skjema med forhåndsutfylt sykmeldt](https://demo.ekstern.dev.nav.no/arbeidsgiver/ansatte/narmesteleder/b8dec976-932a-45d3-b1d4-09debe8e44be)

## Formålet med appen

Appen brukes til å registrere en **nærmeste leder** for en person som er sykmeldt. Den tilbyr to hovedfunksjoner.

```mermaid
graph TD
    Dialogporten[Dialogporten] -->|"/arbeidsgiver/ansatte/narmesteleder/{behovid}"| App[Nærmeste leder frontend]
    MinSide[Min side - arbeidsgiver] -->|"/arbeidsgiver/ansatte/narmesteleder"| App
```

### Registrering via tomt skjema

Inngangen til det tomme skjemaet er appen `Min side - arbeidsgiver`. Brukeren fyller ut informasjon om både den sykmeldte og **nærmeste leder**.

**basePath**[^basepath] `/arbeidsgiver/ansatte/narmesteleder`

### Registrering via forhåndsutfylt skjema

Inngangen til det forhåndsutfylte skjemaet er plattformen `Dialogporten`. Brukeren får presentert en bestemt sykmeldt som mangler **nærmeste leder**, og kan registrere eller oppdatere **nærmeste leder**. Hvis `behovid` ikke er en gyldig GUID, sendes brukeren til not-found-siden.

**basePath**[^basepath] `/arbeidsgiver/ansatte/narmesteleder/{behovid}`

## Backend-API

Frontend-appen kommuniserer med [Nærmesteleder backend](https://github.com/navikt/esyfo-narmesteleder).

Brukte endepunkter

- **GET** `/api/v1/linemanager/requirement/{id}`
- **POST** `/api/v1/linemanager`
- **PUT** `/api/v1/linemanager/requirement/{id}`

## Utvikling (kjøre lokalt)

For å komme i gang med å bygge og kjøre appen, se vår [Wiki for frontendapper](https://navikt.github.io/team-esyfo/utvikling/frontend/).

Når appen er startet, åpne http://localhost:3000/arbeidsgiver/ansatte/narmesteleder

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#esyfo](https://nav-it.slack.com/archives/C012X796B4L).

---

[^basepath]: `basePath`-verdien settes i Next.js-konfigurasjonen i `next.config.ts` og angir URL-prefikset som hele appen lever under.
