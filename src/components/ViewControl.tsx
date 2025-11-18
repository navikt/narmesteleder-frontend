import React from "react";
import type { ViewMode } from "@/context/createContextState";

interface ViewControlProps<T = unknown> {
  Provider: React.ComponentType<T & { children: React.ReactNode }>;
  useMode: () => { mode: ViewMode };
  EditView: React.ComponentType;
  SubmitView: React.ComponentType;
  providerProps?: T;
}

export function ViewControl<T = unknown>({
  Provider,
  useMode: useMode,
  EditView,
  SubmitView,
  providerProps,
}: ViewControlProps<T>) {
  const ViewContent = () => {
    const { mode } = useMode();
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
