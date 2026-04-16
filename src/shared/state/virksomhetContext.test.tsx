import ReactDOMServer from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  useVirksomhetContext,
  VirksomhetProvider,
} from "@/shared/state/virksomhetContext";

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
});
