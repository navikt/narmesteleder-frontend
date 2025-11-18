import React from "react";

interface FlowControlProps<T = unknown> {
  Provider: React.ComponentType<T & { children: React.ReactNode }>;
  useFlow: () => { mode: string };
  EditView: React.ComponentType;
  SubmitView: React.ComponentType;
  providerProps?: T;
}

export function FlowControl<T = unknown>({
  Provider,
  useFlow,
  EditView,
  SubmitView,
  providerProps,
}: FlowControlProps<T>) {
  const FlowContent = () => {
    const { mode } = useFlow();
    if (mode === "editing") {
      return <EditView />;
    }
    return <SubmitView />;
  };

  return (
    <Provider {...(providerProps as T)}>
      <FlowContent />
    </Provider>
  );
}
