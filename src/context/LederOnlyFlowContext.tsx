import { createContext, useContext, useState } from "react";
import {
  LederOnly,
  lederOnlyDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";

interface LederOnlyFlowContextType {
  mode: "editing" | "submitted";
  submittedData: LederOnly;
  handleSuccess: (data: LederOnly) => void;
  handleEdit: () => void;
  lederInfo: LederInfo;
  behovId: string;
}

const LederOnlyFlowContext = createContext<
  LederOnlyFlowContextType | undefined
>(undefined);

export function LederOnlyFlowProvider({
  lederInfo,
  behovId,
  children,
}: {
  lederInfo: LederInfo;
  behovId: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<{
    mode: "editing" | "submitted";
    submittedData: LederOnly;
  }>({
    mode: "editing",
    submittedData: lederOnlyDefaults,
  });

  const handleSuccess = (data: LederOnly) => {
    setState({ mode: "submitted", submittedData: data });
  };

  const handleEdit = () => {
    setState({ mode: "editing", submittedData: state.submittedData });
  };

  return (
    <LederOnlyFlowContext.Provider
      value={{
        mode: state.mode,
        submittedData: state.submittedData,
        handleSuccess,
        handleEdit,
        lederInfo,
        behovId,
      }}
    >
      {children}
    </LederOnlyFlowContext.Provider>
  );
}

export function useLederOnlyFlow() {
  const context = useContext(LederOnlyFlowContext);
  if (!context) {
    throw new Error(
      "useLederOnlyFlow must be used within a LederOnlyFlowProvider",
    );
  }
  return context;
}
