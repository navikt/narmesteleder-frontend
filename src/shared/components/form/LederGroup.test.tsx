import ReactDOMServer from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/shared/components/form/hooks/form", () => ({
  withFieldGroup: vi.fn((config) => config),
}));

import { LederGroup } from "@/shared/components/form/LederGroup";
import { UiSelector } from "@/utils/uiSelectors";

const MOBILNUMMER_DESCRIPTION =
  "For utenlandske nummer, bruk + og landskode, for eksempel +46.";

interface TextInputFieldProps {
  description?: string;
  label?: string;
  type?: string;
  uiSelector?: string;
}

function renderLederGroup() {
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
  const lederGroupConfig = LederGroup as unknown as {
    render: (props: {
      group: { AppField: typeof AppField };
    }) => React.ReactNode;
  };

  ReactDOMServer.renderToStaticMarkup(
    lederGroupConfig.render({
      group: {
        AppField,
      },
    }),
  );

  return TextInputField;
}

describe("LederGroup", () => {
  it("uses international phone-number guidance for mobilnummer", () => {
    const TextInputField = renderLederGroup();
    const mobilnummerField = TextInputField.mock.calls.find(
      ([props]) => props?.uiSelector === UiSelector.Mobilnummer,
    )?.[0];

    expect(mobilnummerField).toMatchObject({
      label: "Mobilnummer",
      description: MOBILNUMMER_DESCRIPTION,
      type: "tel",
    });
  });
});
