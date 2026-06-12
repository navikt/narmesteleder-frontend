import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/components/form/hooks/form", () => ({
  withFieldGroup: vi.fn((config) => config),
}));

const mockState = vi.hoisted(() => ({
  showSelector: false as boolean | undefined,
}));

vi.mock("@/shared/state/virksomhetContext", () => ({
  useOptionalVirksomhetContext: () =>
    mockState.showSelector === undefined
      ? undefined
      : { showSelector: mockState.showSelector },
}));

import { SykmeldtGroup } from "@/shared/components/form/SykmeldtGroup";

const ORGNUMMER_LABEL = "Organisasjonsnummer (9 siffer)";
interface TextInputFieldProps {
  label?: string;
  [key: string]: unknown;
}

function renderSykmeldtGroup(showSelector: boolean | undefined) {
  mockState.showSelector = showSelector;
  const TextInputField = vi.fn((_: TextInputFieldProps) => null);

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

  const markup = ReactDOMServer.renderToStaticMarkup(
    sykmeldtGroupConfig.render({
      group: {
        AppField,
      },
    }),
  );

  return { TextInputField, markup };
}

describe("SykmeldtGroup", () => {
  beforeEach(() => {
    mockState.showSelector = false;
    vi.clearAllMocks();
  });

  it("hides orgnummer text input when virksomhetsvelger is active", () => {
    const { TextInputField, markup } = renderSykmeldtGroup(true);
    const hasOrgnummerField = TextInputField.mock.calls.some(
      ([props]) => props?.label === ORGNUMMER_LABEL,
    );

    expect(hasOrgnummerField).toBe(false);
    expect(markup).not.toContain("valgt orgnummer");
  });

  it("uses orgnummer text input as fallback when virksomhetsvelger is not active", () => {
    const { TextInputField } = renderSykmeldtGroup(false);
    const hasOrgnummerField = TextInputField.mock.calls.some(
      ([props]) => props?.label === ORGNUMMER_LABEL,
    );

    expect(hasOrgnummerField).toBe(true);
  });
});
