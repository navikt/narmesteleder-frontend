import { createContext, useContext, useState } from "react";
import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";

interface SykmeldtLederFlowContextType {
  mode: "editing" | "submitted";
  submittedData: NarmesteLederInfo;
  handleSuccess: (data: NarmesteLederInfo) => void;
  handleEdit: () => void;
}

const SykmeldtLederFlowContext = createContext<
  SykmeldtLederFlowContextType | undefined
>(undefined);

export function SykmeldtLederFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<{
    mode: "editing" | "submitted";
    submittedData: NarmesteLederInfo;
  }>({
    mode: "editing",
    submittedData: narmesteLederInfoDefaults,
  });

  const handleSuccess = (data: NarmesteLederInfo) => {
    setState({ mode: "submitted", submittedData: data });
  };

  const handleEdit = () => {
    setState({ mode: "editing", submittedData: state.submittedData });
  };

  return (
    <SykmeldtLederFlowContext.Provider
      value={{
        mode: state.mode,
        submittedData: state.submittedData,
        handleSuccess,
        handleEdit,
      }}
    >
      {children}
    </SykmeldtLederFlowContext.Provider>
  );
}

export function useSykmeldtLederFlow() {
  const context = useContext(SykmeldtLederFlowContext);
  if (!context) {
    throw new Error(
      "useSykmeldtLederFlow must be used within a SykmeldtLederFlowProvider",
    );
  }
  return context;
}
