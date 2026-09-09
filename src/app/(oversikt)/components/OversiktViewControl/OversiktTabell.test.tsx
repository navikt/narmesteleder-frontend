import ReactDOMServer from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";
import {
  ADD_LINEMANAGER_LABEL,
  getAddLinemanagerHref,
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

function renderTable(): string {
  return ReactDOMServer.renderToStaticMarkup(
    <OversiktTabell requirements={[requirement]} orgnr="963890095" />,
  );
}

describe("OversiktTabell", () => {
  it("viser Figma-kolonner og samlet informasjon om den ansatte", () => {
    const markup = renderTable();
    const tableHeader = markup.match(/<thead[^>]*>(.*?)<\/thead>/)?.[1] ?? "";

    expect(tableHeader.match(/<th(?:\s|>)/g)).toHaveLength(3);
    expect(tableHeader).toContain("Ansatt");
    expect(tableHeader).toContain("Nærmeste leder");
    expect(tableHeader).toContain("Handling");
    expect(tableHeader).not.toContain("Navn");
    expect(tableHeader).not.toContain("Fødselsnummer");
    expect(tableHeader).not.toContain("Handlinger");
    expect(markup).toContain("Test Mellom Ansatt");
    expect(markup).toContain("268955 14420");
    expect(markup).toContain("Ikke registrert");
  });

  it("viser tilgjengelig handlingsmeny med trygg registreringslenke", () => {
    const markup = renderTable();
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
});
