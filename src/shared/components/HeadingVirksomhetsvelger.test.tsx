import ReactDOMServer from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeadingVirksomhetsvelgerContent } from "@/shared/components/HeadingVirksomhetsvelger";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";

const renderVirksomhet = (orgnavn: string) =>
  ReactDOMServer.renderToStaticMarkup(
    <VirksomhetProvider initialVirksomhet={{ orgnummer: "963890095", orgnavn }}>
      <HeadingVirksomhetsvelgerContent />
    </VirksomhetProvider>,
  );

describe("HeadingVirksomhetsvelgerContent", () => {
  it("shows the formatted organization number without parentheses when orgnavn is empty", () => {
    const markup = renderVirksomhet("");

    expect(markup).toContain("963 890 095");
    expect(markup).not.toContain("(963 890 095)");
  });

  it("shows orgnavn followed by the formatted organization number", () => {
    expect(renderVirksomhet("Test AS")).toContain("Test AS (963 890 095)");
  });
});
