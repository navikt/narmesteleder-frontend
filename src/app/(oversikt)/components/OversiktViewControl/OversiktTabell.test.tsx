import ReactDOMServer from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { mockLinemanagerIds } from "@/mocks/data/mockLinemanagerSearch";
import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";
import type { LinemanagerSearchItem } from "@/schemas/lineManagerSearchSchema";
import { UiSelector } from "@/utils/uiSelectors";
import {
  ADD_LINEMANAGER_LABEL,
  getAddLinemanagerHref,
  getEditLinemanagerHref,
  OversiktTabell,
} from "./OversiktTabell";

const requirement: RequirementsListItem = {
  id: "699e9702-b042-493d-8c20-a02c7c6c86ba",
  employeeIdentificationNumber: "26895514420",
  orgNumber: "963890095",
  orgName: "Test AS",
  mainOrgNumber: "811076732",
  managerIdentificationNumber: null,
  name: {
    firstName: "Test",
    middleName: "Mellom",
    lastName: "Ansatt",
  },
  isActive: true,
};

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

function renderMissingLinemanagerTable(): string {
  return ReactDOMServer.renderToStaticMarkup(
    <OversiktTabell
      variant="missing-linemanager"
      requirements={[requirement]}
      orgNumber="963890095"
    />,
  );
}

function renderLinemanagerTable(hasActiveSickLeave: boolean): string {
  return ReactDOMServer.renderToStaticMarkup(
    <OversiktTabell
      variant="linemanager"
      linemanagers={[linemanager]}
      orgNumber="963890095"
      hasActiveSickLeave={hasActiveSickLeave}
      onRevoke={vi.fn()}
    />,
  );
}

describe("OversiktTabell", () => {
  it("bruker den samme tabellroten for alle filtervarianter", () => {
    const selector = `data-testid="${UiSelector.OversiktTabell}"`;

    expect(renderMissingLinemanagerTable()).toContain(selector);
    expect(renderLinemanagerTable(true)).toContain(selector);
    expect(renderLinemanagerTable(false)).toContain(selector);
  });

  it("viser samme desktop- og mobilstruktur som tabellene med registrert leder", () => {
    const markup = renderMissingLinemanagerTable();
    const tableHeaders = [
      ...markup.matchAll(/<thead[^>]*>(.*?)<\/thead>/g),
    ].map((match) => match[1]);
    const desktopHeader = tableHeaders.find((header) =>
      header.includes("Kontaktinformasjon"),
    );
    const mobileHeader = tableHeaders.find(
      (header) => !header.includes("Kontaktinformasjon"),
    );

    expect(desktopHeader?.match(/<th(?:\s|>)/g)).toHaveLength(5);
    expect(desktopHeader).toContain("Ansatt");
    expect(desktopHeader).toContain("Nærmeste leder");
    expect(desktopHeader).toContain("Kontaktinformasjon");
    expect(desktopHeader).toContain("Leder siden");
    expect(desktopHeader).toContain("Handling");
    expect(mobileHeader?.match(/<th(?:\s|>)/g)).toHaveLength(4);
    expect(mobileHeader).toContain("Vis detaljer");
    expect(mobileHeader).toContain("Ansatt");
    expect(mobileHeader).toContain("Nærmeste leder");
    expect(mobileHeader).toContain("Handling");
    expect(markup).toContain("Test Mellom Ansatt");
    expect(markup).toContain("268955 14420");
    expect(markup).toContain("Ikke registrert");
    expect(markup).toContain("Fødselsnummer for ansatt");
    expect(markup).toContain("Fødselsnummer for nærmeste leder");
  });

  it("viser tilgjengelig handlingsmeny med trygg registreringslenke", () => {
    const markup = renderMissingLinemanagerTable();
    const href = getAddLinemanagerHref(requirement.id, "963890095");

    expect(markup).toContain('aria-label="Handlinger for Test Mellom Ansatt"');
    expect(markup).toContain('title="Handlinger for Test Mellom Ansatt"');
    expect(ADD_LINEMANAGER_LABEL).toBe("Legg til nærmeste leder");
    expect(href).toBe(
      "/arbeidsgiver/ansatte/narmesteleder/699e9702-b042-493d-8c20-a02c7c6c86ba?returnTo=%2Foversikt%3Forgnr%3D963890095%26tab%3Dmangler-leder",
    );
    expect(href).not.toContain(requirement.employeeIdentificationNumber);
    expect(href).not.toContain(requirement.name.firstName);
    expect(href).not.toContain(requirement.name.middleName ?? "");
    expect(href).not.toContain(requirement.name.lastName);
  });

  it("lager aktiv endrelenke med bare relasjons-ID og sikker returadresse", () => {
    const markup = renderLinemanagerTable(true);
    const href = getEditLinemanagerHref(linemanager.linemanagerId, "963890095");

    expect(markup).toContain('aria-label="Handlinger for Test Employee"');
    expect(markup).toContain('title="Handlinger for Test Employee"');
    expect(href).toBe(
      "/arbeidsgiver/ansatte/narmesteleder/endre/11111111-1111-4111-8111-111111111111?returnTo=%2Foversikt%3Forgnr%3D963890095%26tab%3Daktiv-sykmelding",
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
    const markup = renderLinemanagerTable(false);

    expect(markup).not.toContain("Endre nærmeste leder");
    expect(markup).toContain('aria-label="Handlinger for Test Employee"');
  });

  it("viser lederdata i den felles tabellstrukturen", () => {
    const markup = renderLinemanagerTable(true);
    const tableHeaders = [
      ...markup.matchAll(/<thead[^>]*>(.*?)<\/thead>/g),
    ].map((match) => match[1]);
    const desktopHeader = tableHeaders.find((header) =>
      header.includes("Kontaktinformasjon"),
    );

    expect(desktopHeader?.match(/<th(?:\s|>)/g)).toHaveLength(5);
    expect(markup).toContain("Test Employee");
    expect(markup).toContain("employee-identifier");
    expect(markup).toContain("Test Manager");
    expect(markup).toContain("manager-identifier");
    expect(markup).toContain(linemanager.manager.email);
    expect(markup).toContain(linemanager.manager.mobile);
  });

  it("viser bare navn i kollapsede mobilrader og beholder detaljene i utvidelsen", () => {
    const markup = renderLinemanagerTable(true);
    const tableHeaders = [
      ...markup.matchAll(/<thead[^>]*>(.*?)<\/thead>/g),
    ].map((match) => match[1]);
    const mobileHeader = tableHeaders.find(
      (header) => !header.includes("Kontaktinformasjon"),
    );

    expect(mobileHeader?.match(/<th(?:\s|>)/g)).toHaveLength(4);
    expect(mobileHeader).toContain("Vis detaljer");
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
