import {
  LederOnly,
  lederOnlyDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { createFlowContext } from "./createFlowContext";

export const { Provider: LederOnlyFlowProvider, useFlow: useLederOnlyFlow } =
  createFlowContext<LederOnly, { lederInfo: LederInfo; behovId: string }>(
    lederOnlyDefaults,
    (props: { lederInfo: LederInfo; behovId: string }) => ({
      lederInfo: props.lederInfo,
      behovId: props.behovId,
    }),
  );
