import { describe, expect, it } from "vitest";
import { sykmeldtFormSchema } from "@/schemas/nærmestelederFormSchema";
import { ValidationMessages } from "@/utils/validationMessages";

const validSykmeldt = {
  fodselsnummer: "12345678901",
  etternavn: "Testersen",
};

describe("sykmeldtFormSchema", () => {
  it("accepts et 9-sifret organisasjonsnummer", () => {
    const result = sykmeldtFormSchema.safeParse({
      ...validSykmeldt,
      orgnummer: "963890095",
    });

    expect(result.success).toBe(true);
  });

  it("trimmer organisasjonsnummer før validering", () => {
    const result = sykmeldtFormSchema.safeParse({
      ...validSykmeldt,
      orgnummer: " 963890095 ",
    });

    expect(result.success).toBe(true);
  });

  it("avviser tomt organisasjonsnummer", () => {
    const result = sykmeldtFormSchema.safeParse({
      ...validSykmeldt,
      orgnummer: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.RequireField,
    );
  });

  it("avviser organisasjonsnummer som ikke er 9 siffer", () => {
    const result = sykmeldtFormSchema.safeParse({
      ...validSykmeldt,
      orgnummer: "12345678",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidOrgnummer,
    );
  });

  it("avviser organisasjonsnummer med bokstaver", () => {
    const result = sykmeldtFormSchema.safeParse({
      ...validSykmeldt,
      orgnummer: "12345678a",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidOrgnummer,
    );
  });
});
