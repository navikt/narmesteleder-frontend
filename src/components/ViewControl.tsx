import React from "react";
import type { ViewMode } from "@/context/createContextState";

type ViewControlProps<T extends object> = {
  Provider: React.ComponentType<{ children: React.ReactNode } & T>;
  useContextState: () => { mode: ViewMode };
  EditView: React.ComponentType;
  SubmitView: React.ComponentType;
  providerProps?: T;
};

export function ViewControl<T extends object>({
  Provider,
  useContextState,
  EditView,
  SubmitView,
  providerProps,
}: ViewControlProps<T>) {
  const ViewContent = () => {
    const { mode } = useContextState();
    if (mode === "editing") {
      return <EditView />;
    }
    return <SubmitView />;
  };
  return (
    <Provider {...(providerProps as T)}>
      <ViewContent />
    </Provider>
  );
}
