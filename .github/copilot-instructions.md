# narmesteleder-frontend

```sh
pnpm dev
pnpm test --run
pnpm test:e2e
pnpm lint
pnpm build
```

`mise run verify` runs fixing commands and can change files.

- The base path is `/arbeidsgiver/ansatte/narmesteleder`.
- Playwright starts the app in `demo` mode and may reuse a running server.
  An existing local server must also use demo fixtures for stable E2E results.
  Shared test IDs belong in `src/utils/uiSelectors.ts`.
- Keep backend calls on `TokenXTargetApi` and the `src/server/tokenXFetch.ts`
  helpers; they preserve target-specific token exchange, response validation
  and safe frontend errors.
- Runtime logging uses the allowlisted operation/error contract in
  `src/server/observability/`; do not pass backend bodies, URLs containing
  identifiers, or raw auth/fetch exceptions to the logger.
