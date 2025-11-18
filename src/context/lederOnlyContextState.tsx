import {
  LederOnly,
  lederOnlyDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { createContextState } from "./createContextState";

export const {
  Provider: LederOnlyProvider,
  useContextState: useLederOnlyContextState,
} = createContextState<LederOnly, { lederInfo: LederInfo; behovId: string }>(
  lederOnlyDefaults,
  (props: { lederInfo: LederInfo; behovId: string }) => ({
    lederInfo: props.lederInfo,
    behovId: props.behovId,
  }),
);
