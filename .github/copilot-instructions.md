# Copilot instructions for narmesteleder-frontend

## Build, test, and lint commands

Use `pnpm` (repo is pinned to pnpm 10 / Node 24 via `.mise.toml`).

- Install: `pnpm install`
- Dev server: `pnpm run dev`
- Build: `pnpm run build`
- Lint: `pnpm run lint`
- Auto-fix lint/style: `pnpm run lint:fix`
- Unit tests (Vitest): `pnpm run test`
- E2E tests (Playwright): `pnpm run test:e2e`

Single-test commands:

- Run one Vitest file: `pnpm test src/utils/formatting.test.ts`
- Run one Vitest test case: `pnpm test src/utils/formatting.test.ts -t "should join multiple strings with default separator"`
- Run one Playwright spec: `pnpm test:e2e e2e/create-linemanager.spec.ts`
- Run one Playwright test by title: `pnpm test:e2e e2e/create-linemanager.spec.ts -g "should display edit view"`

## High-level architecture

- This is a Next.js App Router app under base path `/arbeidsgiver/ansatte/narmesteleder` (`next.config.ts`, `NEXT_PUBLIC_BASE_PATH`).
- Two top-level user flows:
  - `src/app/page.tsx`: create relation via empty form (`SykmeldtAndLederViewControl`).
  - `src/app/[behovId]/page.tsx`: update relation for a specific requirement; validates `behovId` with zod and loads backend data via `LederInfoLoader`.
- Server communication is centralized in `src/server/*`:
  - `fetchData/fetchLederInfo.ts` for read calls.
  - `actions/opprettNarmesteLeder.ts` and `actions/oppdaterNarmesteLeder.ts` for writes.
  - `tokenXFetch.ts` wraps GET/POST/PUT fetches, token exchange, zod response validation, and frontend error mapping.
- Auth path: IdPorten token validation (`src/auth/validateIdPortenToken.ts`) -> TokenX exchange (`src/utils/tokenX.ts`) -> backend call.
- Environment behavior split:
  - `local`/`demo` uses mocks (`src/mocks/*`) and supports `mockScenario` in `[behovId]` route.
  - other envs call real backend/Lumi endpoints from `getServerEnv()`.
- Internal routes:
  - health: `/api/internal/isAlive`, `/api/internal/isReady`
  - frontend logging ingestion: `/api/logger` via `@navikt/next-logger/app-dir`.

## Key codebase conventions

- Reuse Aksel spacing/component conventions from `.github/instructions/nextjs-aksel-instructions.md`:
  - prefer Aksel components (`Box`, `VStack`, `HStack`, etc.)
  - use `space-*` tokens for spacing props
  - avoid Tailwind margin/padding utilities for layout spacing decisions
- Form stack convention:
  - TanStack React Form through `useAppForm` helpers in `src/components/form/hooks`.
  - Validation comes from zod schemas in `src/schemas/*` (`validators: { onDynamic: ... }`).
- Edit/submit UI state is standardized with `createContextState` (`src/context/createContextState.tsx`) and per-flow context wrappers.
- Keep schema-first boundaries:
  - validate route params, form payloads, and backend responses with zod before use.
  - keep env access through `publicEnv`/`getServerEnv` only (both zod-validated).
- Keep API targets and headers centralized:
  - use `TokenXTargetApi` and `tokenXFetchGet`/`tokenXFetchUpdate`, not ad-hoc fetches.
- Keep test selectors centralized in `src/utils/testIds.ts`; e2e tests import the enum directly.
