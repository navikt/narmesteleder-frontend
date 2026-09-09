import ReactDOMServer from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { mockLinemanagerIds } from "@/mocks/data/mockLinemanagerSearch";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import {
  canChangeLinemanager,
  getEditLinemanagerHref,
  LinemanagerTabell,
} from "./LinemanagerTabell";

const linemanager: LinemanagerSearchItem = {
  linemanagerId: mockLinemanagerIds.activeKari,
  orgNumber: "963890095",
  activeFrom: "2023-01-15T00:00:00Z",
  employee: {
    nationalIdentificationNumber: "employee-identifier",
    name: { firstName: "Test", middleName: null, lastName: "Employee" },
  },
  manager: {
    nationalIdentificationNumber: "manager-identifier",
    name: { firstName: "Test", middleName: null, lastName: "Manager" },
    email: "test@example.test",
    mobile: "00000000",
  },
};

function renderTable(hasActiveSickLeave: boolean): string {
  return ReactDOMServer.renderToStaticMarkup(
    <LinemanagerTabell
      linemanagers={[linemanager]}
      orgNumber="963890095"
      hasActiveSickLeave={hasActiveSickLeave}
      onRevoke={vi.fn()}
    />,
  );
}

describe("LinemanagerTabell", () => {
  it("lager aktiv endrelenke med bare relasjons-ID og sikker returadresse", () => {
    const markup = renderTable(true);
    const href = getEditLinemanagerHref(linemanager.linemanagerId, "963890095");

    expect(markup).toContain('aria-label="Handlinger for Test Employee"');
    expect(markup).toContain('title="Handlinger for Test Employee"');
    expect(href).toBe(
      "/endre/11111111-1111-4111-8111-111111111111?returnTo=%2Foversikt%3Forgnr%3D963890095%26tab%3Daktiv-sykmelding",
    );
    expect(href).not.toContain(
      linemanager.employee.nationalIdentificationNumber,
    );
    expect(href).not.toContain(
      linemanager.manager.nationalIdentificationNumber,
    );
    expect(href).not.toContain(linemanager.manager.email);
    expect(href).not.toContain(linemanager.manager.mobile);
    expect(href).not.toContain(linemanager.employee.name?.firstName ?? "");
    expect(href).not.toContain(linemanager.manager.name?.firstName ?? "");
  });

  it("utelater endrehandling for inaktive rader og beholder handlingsmenyen", () => {
    const markup = renderTable(false);

    expect(canChangeLinemanager(false)).toBe(false);
    expect(markup).not.toContain("Endre nærmeste leder");
    expect(markup).toContain('aria-label="Handlinger for Test Employee"');
  });

  it("viser endrehandling for aktive rader", () => {
    expect(canChangeLinemanager(true)).toBe(true);
  });

  it("viser fem Figma-kolonner med samlet informasjon per person", () => {
    const markup = renderTable(true);
    const tableHeaders = [
      ...markup.matchAll(/<thead[^>]*>(.*?)<\/thead>/g),
    ].map((match) => match[1]);
    const desktopHeader = tableHeaders.find((header) =>
      header.includes("Kontaktinformasjon"),
    );

    expect(desktopHeader?.match(/<th(?:\s|>)/g)).toHaveLength(5);
    expect(desktopHeader).toContain("Ansatt");
    expect(desktopHeader).toContain("Nærmeste leder");
    expect(desktopHeader).toContain("Kontaktinformasjon");
    expect(desktopHeader).toContain("Leder siden");
    expect(desktopHeader).toContain("Handling");
    expect(markup).toContain("Test Employee");
    expect(markup).toContain("employee-identifier");
    expect(markup).toContain("Test Manager");
    expect(markup).toContain("manager-identifier");
    expect(markup).toContain(linemanager.manager.email);
    expect(markup).toContain(linemanager.manager.mobile);
  });

  it("viser bare navn i kollapsede mobilrader og beholder detaljene i utvidelsen", () => {
    const markup = renderTable(true);
    const tableHeaders = [
      ...markup.matchAll(/<thead[^>]*>(.*?)<\/thead>/g),
    ].map((match) => match[1]);
    const mobileHeader = tableHeaders.find(
      (header) => !header.includes("Kontaktinformasjon"),
    );

    expect(mobileHeader?.match(/<th(?:\s|>)/g)).toHaveLength(4);
    expect(mobileHeader).toContain("Vis detaljer");
    expect(mobileHeader).toContain("Ansatt");
    expect(mobileHeader).toContain("Nærmeste leder");
    expect(mobileHeader).toContain("Handling");
    expect(markup).toContain("Fødselsnummer for ansatt");
    expect(markup).toContain("Fødselsnummer for nærmeste leder");
    expect(markup).toContain("Kontaktinformasjon");
    expect(markup).toContain("Leder siden");
    expect(
      markup.split(linemanager.employee.nationalIdentificationNumber),
    ).toHaveLength(3);
    expect(
      markup.split(linemanager.manager.nationalIdentificationNumber),
    ).toHaveLength(3);
  });
});
