import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function lint(source: string, path = "src/server/example.ts") {
  const fixture = mkdtempSync(join(tmpdir(), "logging-policy-"));
  try {
    copyFileSync("biome.json", join(fixture, "biome.json"));
    copyFileSync(".gitignore", join(fixture, ".gitignore"));
    mkdirSync(dirname(join(fixture, path)), { recursive: true });
    writeFileSync(join(fixture, path), source);
    return spawnSync(
      resolve("node_modules/.bin/biome"),
      [
        "lint",
        "--only=style/noRestrictedImports",
        "--only=style/noCommonJs",
        "--only=suspicious/noConsole",
        path,
      ],
      { cwd: fixture, encoding: "utf8" },
    );
  } finally {
    rmSync(fixture, { recursive: true });
  }
}

describe("logging entry point policy", () => {
  it.each([
    'import { logger } from "@navikt/next-logger";',
    'import { logger as native } from "@navikt/next-logger";',
    'import * as native from "@navikt/next-logger";',
    'export { logger } from "@navikt/next-logger";',
    'const native = require("pino");',
    'const native = await import("@navikt/pino-logger");',
    'import { createLogger } from "@navikt/esyfo-logger";',
    'import { createEventLogger } from "@navikt/esyfo-logger";',
    'import * as logging from "@navikt/esyfo-logger";',
    'const { createLogger } = await import("@navikt/esyfo-logger");',
    'export { createLogger as makeLogger } from "@navikt/esyfo-logger";',
    'export * from "@navikt/esyfo-logger";',
    'import { backendLogger } from "@navikt/next-logger/backend";',
    'import console from "node:console";',
    'console.error("failed");',
  ])("rejects bypass: %s", (source) => {
    const result = lint(source);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/noRestrictedImports|noCommonJs|noConsole/);
  });

  it("allows local log calls and local definitions", () => {
    expect(
      lint(`
        import { defineEvent } from "@navikt/esyfo-logger";
        import { log } from "@/server/observability/logger";
        log.info("Ready");
      `).status,
    ).toBe(0);
  });

  it.each([
    "src/server/observability/logger.ts",
    "src/server/example.test.ts",
    "src/app/error.tsx",
    "src/app/Providers.tsx",
    "src/app/api/logger/route.ts",
  ])("keeps the explicit integration/test exception: %s", (path) => {
    expect(
      lint('import { logger } from "@navikt/next-logger";', path).status,
    ).toBe(0);
  });

  it("also covers server components", () => {
    expect(
      lint(
        'import { logger } from "@navikt/next-logger";',
        "src/app/example/page.tsx",
      ).status,
    ).toBe(1);
  });
});
