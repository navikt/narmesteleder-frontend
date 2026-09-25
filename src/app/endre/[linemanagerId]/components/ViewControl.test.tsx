import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { expect, it, vi } from "vitest";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";

const providerProps = vi.hoisted(() => ({
  current: undefined as Record<string, unknown> | undefined,
  edit: undefined as Record<string, unknown> | undefined,
}));

vi.mock("@/shared/state/virksomhetContext", () => ({
  VirksomhetProvider: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => {
    providerProps.current = props;
    return <>{children}</>;
  },
}));

vi.mock("./EditView", () => ({
  EditView: (props: Record<string, unknown>) => {
    providerProps.edit = props;
    return <div>EditView</div>;
  },
}));

vi.mock("./SubmitView", () => ({
  SubmitView: () => <div>SubmitView</div>,
}));

import { ViewControl } from "./ViewControl";

it("uses endpoint organization context for VirksomhetProvider, independently of form data", () => {
  const initialData = {
    sykmeldt: {
      fodselsnummer: "employee-id",
      etternavn: "Nordmann",
      orgnummer: "form-org-number",
    },
    leder: {
      fodselsnummer: "",
      etternavn: "",
      mobilnummer: "",
      epost: "",
    },
  } satisfies NarmesteLederInfo;
  const initialVirksomhet = {
    orgnummer: "endpoint-org-number",
    orgnavn: "Shark AS",
  };

  ReactDOMServer.renderToStaticMarkup(
    <ViewControl
      initialData={initialData}
      initialVirksomhet={initialVirksomhet}
      isSykmeldtKnown={false}
    />,
  );

  expect(providerProps.current).toEqual({ initialVirksomhet });
  expect(providerProps.edit).toEqual(
    expect.objectContaining({ initialData, isSykmeldtKnown: false }),
  );
});
