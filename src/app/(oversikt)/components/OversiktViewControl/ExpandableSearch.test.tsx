import ReactDOMServer from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { UiSelector } from "@/utils/uiSelectors";
import { ExpandableSearch } from "./ExpandableSearch";

describe("ExpandableSearch", () => {
  it("viser bare søkeknappen i standardtilstanden", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <ExpandableSearch
        value=""
        onChange={vi.fn()}
        data-testid={UiSelector.OversiktSok}
      />,
    );

    expect(markup).toContain(
      `data-testid="${UiSelector.ExpandableSearchTrigger}"`,
    );
    expect(markup).toContain("Søk");
    expect(markup).not.toContain("Søk etter ansatt");
    expect(markup).not.toContain("Søk med navn eller fødselsnummer");
    expect(markup).not.toContain(`data-testid="${UiSelector.OversiktSok}"`);
  });
});
