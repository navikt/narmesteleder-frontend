import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFrontendError,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "@/server/narmesteLederErrorUtils";

const { fetchLinemanagerReplacementMock } = vi.hoisted(() => ({
  fetchLinemanagerReplacementMock: vi.fn(),
}));

vi.mock("@/server/fetchData/fetchLinemanagerReplacement", () => ({
  fetchLinemanagerReplacement: fetchLinemanagerReplacementMock,
}));

vi.mock("@/shared/components/LederInfoError", () => ({
  LederInfoError: () => <div>Mapped error</div>,
}));

vi.mock("./ViewControl", () => ({
  ViewControl: () => <div>Replacement form</div>,
}));

import { ReplacementLoader } from "./ReplacementLoader";

describe("ReplacementLoader", () => {
  beforeEach(() => {
    fetchLinemanagerReplacementMock.mockReset();
  });

  it("shows the standard not-found page for invalid or missing IDs", async () => {
    const element = await ReplacementLoader({ unavailable: true });
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    expect(markup).toContain("Beklager, vi fant ikke siden");
    expect(fetchLinemanagerReplacementMock).not.toHaveBeenCalled();
  });

  it("shows the standard not-found page when the relation is absent", async () => {
    fetchLinemanagerReplacementMock.mockResolvedValue(null);
    const element = await ReplacementLoader({ linemanagerId: "relation-id" });
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    expect(markup).toContain("Beklager, vi fant ikke siden");
  });

  it("uses the established mapped error presentation", async () => {
    fetchLinemanagerReplacementMock.mockRejectedValue(
      createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL),
    );
    const element = await ReplacementLoader({ linemanagerId: "relation-id" });
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    expect(markup).toContain("Mapped error");
  });
});
