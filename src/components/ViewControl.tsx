import React from "react";

interface ViewControlProps<T = unknown> {
  Provider: React.ComponentType<T & { children: React.ReactNode }>;
  useFlow: () => { mode: string };
  EditView: React.ComponentType;
  SubmitView: React.ComponentType;
  providerProps?: T;
}

export function ViewControl<T = unknown>({
  Provider,
  useFlow,
  EditView,
  SubmitView,
  providerProps,
}: ViewControlProps<T>) {
  const ViewContent = () => {
    const { mode } = useFlow();
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
