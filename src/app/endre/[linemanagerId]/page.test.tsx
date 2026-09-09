import { describe, expect, it, vi } from "vitest";

vi.mock("./components/ReplacementLoader", () => ({
  ReplacementLoader: () => null,
}));

import ReplacementPage from "./page";

describe("ReplacementPage", () => {
  it("does not load a relation for an invalid linemanager ID", async () => {
    const element = await ReplacementPage({
      params: Promise.resolve({ linemanagerId: "invalid-id" }),
      searchParams: Promise.resolve({}),
    });

    expect(element.props).toMatchObject({ unavailable: true });
  });
});
