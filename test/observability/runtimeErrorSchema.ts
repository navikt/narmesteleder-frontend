import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import Ajv from "ajv";

const schemaDirectory = new URL("./runtime-error-v1.0.0/", import.meta.url);
const schemaBytes = readFileSync(new URL("schema.json", schemaDirectory));
const expectedChecksum = readFileSync(
  new URL("SHA256SUMS.txt", schemaDirectory),
  "utf8",
).split(/\s+/)[0];

assert.equal(
  createHash("sha256").update(schemaBytes).digest("hex"),
  expectedChecksum,
  "Runtime-schemaet må være byte-identisk med den pinnede versjonen",
);

const ajv = new Ajv({ strict: true, allErrors: true });
const validate = ajv.compile(JSON.parse(schemaBytes.toString("utf8")));

export function assertRuntimeErrorSchema(log: unknown): void {
  assert.ok(validate(log), ajv.errorsText(validate.errors));
}
