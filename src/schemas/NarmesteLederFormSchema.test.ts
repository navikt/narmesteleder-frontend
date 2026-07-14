import { describe, expect, it } from "vitest";
import { narmesteLederFormSchema } from "@/schemas/nærmestelederFormSchema";
import { ValidationMessages } from "@/utils/validationMessages";

const validLeder = {
  fodselsnummer: "12345678901",
  etternavn: "Testersen",
  epost: "test@example.com",
};

describe("narmesteLederFormSchema – mobilnummer", () => {
  it("godtar norsk 8-sifret mobilnummer", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "91234567",
    });
    expect(result.success).toBe(true);
  });

  it("godtar norsk mobilnummer med +47-prefiks", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "+4791234567",
    });
    expect(result.success).toBe(true);
  });

  it("godtar svensk mobilnummer med +46-prefiks", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "+46701234567",
    });
    expect(result.success).toBe(true);
  });

  it("godtar svensk nummer med 0046-prefiks (bare siffer, innenfor lengde)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "0046701234567",
    });
    expect(result.success).toBe(true);
  });

  it("godtar nummer på 6 siffer (nedre grense)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("godtar nummer på 16 siffer (øvre grense)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "1234567890123456",
    });
    expect(result.success).toBe(true);
  });

  it("godtar nummer på 16 siffer med + (øvre grense med prefiks)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "+1234567890123456",
    });
    expect(result.success).toBe(true);
  });

  it("avviser tomt mobilnummer", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.RequireField,
    );
  });

  it("avviser +1 (for kort – kun 1 siffer)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "+1",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidMobilnummer,
    );
  });

  it("avviser enkeltsiffer uten prefiks (for kort)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "1",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidMobilnummer,
    );
  });

  it("avviser nummer på 5 siffer (under nedre grense)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "12345",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidMobilnummer,
    );
  });

  it("avviser nummer på 17 siffer (over øvre grense)", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "12345678901234567",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidMobilnummer,
    );
  });

  it("avviser bokstaver i mobilnummer", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "9123456a",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidMobilnummer,
    );
  });

  it("avviser flere plusstegn", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "++4791234567",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidMobilnummer,
    );
  });

  it("avviser pluss i midten av nummeret", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "912+34567",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ValidationMessages.InvalidMobilnummer,
    );
  });

  it("trimmer mellomrom før validering", () => {
    const result = narmesteLederFormSchema.safeParse({
      ...validLeder,
      mobilnummer: "  91234567  ",
    });
    expect(result.success).toBe(true);
  });
});
