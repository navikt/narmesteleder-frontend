import ReactDOMServer from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/components/form/hooks/form", () => ({
  withFieldGroup: vi.fn((config) => config),
}));

const loadSykmeldtGroup = async (isLocalOrDemo: boolean) => {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", () => ({
    isLocalOrDemo,
  }));

  return await import("@/shared/components/form/SykmeldtGroup");
};

describe("SykmeldtGroup", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.doUnmock("@/env-variables/envHelpers");
  });

  it("uses TextInputField for orgnummer when environment is not local or demo", async () => {
    const { SykmeldtGroup } = await loadSykmeldtGroup(false);
    const TextInputField = vi.fn(() => null);

    const AppField = ({
      children,
    }: {
      children: (field: {
        TextInputField: typeof TextInputField;
      }) => React.ReactNode;
    }) =>
      children({
        TextInputField,
      });
    const sykmeldtGroupConfig = SykmeldtGroup as unknown as {
      render: (props: {
        group: { AppField: typeof AppField };
      }) => React.ReactNode;
    };

    ReactDOMServer.renderToStaticMarkup(
      sykmeldtGroupConfig.render({
        group: {
          AppField,
        },
      }),
    );

    expect(TextInputField).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "Organisasjonsnummer (9 siffer)",
      }),
      undefined,
    );
  });
});
