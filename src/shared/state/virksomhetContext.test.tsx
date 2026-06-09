import ReactDOMServer from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  useVirksomhetContext,
  VirksomhetProvider,
} from "@/shared/state/virksomhetContext";

const organisasjoner = [
  {
    orgnr: "100000020",
    navn: "Eksempel AS",
    underenheter: [
      {
        orgnr: "100000002",
        navn: "Eksempel FLI",
        underenheter: [],
      },
      {
        orgnr: "100000003",
        navn: "Eksempel BEDR",
        underenheter: [],
      },
    ],
  },
];

function HookConsumer() {
  const {
    orgnummer,
    orgnavn,
    updateVirksomhet,
    selectorInteractionCount,
    markSelectorInteracted,
  } = useVirksomhetContext();

  return (
    <div>
      {orgnummer}|{orgnavn}|{typeof updateVirksomhet}|{selectorInteractionCount}
      |{typeof markSelectorInteracted}
    </div>
  );
}

describe("virksomhetContext", () => {
  it("throws when hook is used outside provider", () => {
    expect(() => ReactDOMServer.renderToStaticMarkup(<HookConsumer />)).toThrow(
      "useVirksomhetContext must be used within VirksomhetProvider",
    );
  });

  it("provides default virksomhet values and update function", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <VirksomhetProvider>
        <HookConsumer />
      </VirksomhetProvider>,
    );

    expect(markup).toContain("||function|0|function");
  });

  it("preselects the first available underenhet when selector is enabled", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <VirksomhetProvider organisasjoner={organisasjoner} isSelectable>
        <HookConsumer />
      </VirksomhetProvider>,
    );

    expect(markup).toContain("100000002|Eksempel FLI|function|0|function");
  });
});
