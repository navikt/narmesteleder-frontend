import { ComponentType, createContext, useContext, useState } from "react";

export type ViewMode = "editing" | "submitted";

export function createContextState<T, P extends object = object>(
  defaults: T,
  extraProviderProps?: (props: P) => P,
) {
  type ContextType = {
    mode: ViewMode;
    submittedData: T;
    handleSuccess: (data: T) => void;
    handleEdit: () => void;
  } & P;

  const Context = createContext<ContextType | undefined>(undefined);

  function useContextState() {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useContextState must be used within its Provider");
    }
    return context;
  }

  function ViewControl({
    EditView,
    SubmitView,
    ...props
  }: {
    EditView: ComponentType;
    SubmitView: ComponentType;
  } & P) {
    const [state, setState] = useState<{
      mode: ViewMode;
      submittedData: T;
    }>({
      mode: "editing",
      submittedData: defaults,
    });

    const handleSuccess = (data: T) => {
      setState({ mode: "submitted", submittedData: data });
    };

    const handleEdit = () => {
      setState({ mode: "editing", submittedData: state.submittedData });
    };

    const CurrentView = state.mode === "editing" ? EditView : SubmitView;

    return (
      <Context.Provider
        value={
          {
            mode: state.mode,
            submittedData: state.submittedData,
            handleSuccess,
            handleEdit,
            ...(extraProviderProps ? extraProviderProps(props as P) : {}),
          } as ContextType
        }
      >
        <CurrentView />
      </Context.Provider>
    );
  }

  return { ViewControl, useContextState };
}
