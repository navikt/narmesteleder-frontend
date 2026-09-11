import { describe, expect, it, vi } from "vitest";
import { mockLinemanagerIds } from "@/mocks/data/mockLinemanagerSearch";

vi.mock("./components/ReplacementLoader", () => ({
  ReplacementLoader: () => null,
}));

import ReplacementPage from "./page";

describe("ReplacementPage", () => {
  it("passes a valid linemanager ID to the replacement loader", async () => {
    const linemanagerId = mockLinemanagerIds.activeKari;
    const element = await ReplacementPage({
      params: Promise.resolve({ linemanagerId }),
      searchParams: Promise.resolve({ returnTo: "/oversikt" }),
    });

    expect(element.props.children.props).toMatchObject({
      linemanagerId,
      returnTo: "/oversikt",
    });
  });

  it("does not load a relation for an invalid linemanager ID", async () => {
    const element = await ReplacementPage({
      params: Promise.resolve({ linemanagerId: "invalid-id" }),
      searchParams: Promise.resolve({}),
    });

    expect(element.props).toMatchObject({ unavailable: true });
  });
});
