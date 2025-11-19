import { Leder, lederDefaults } from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { createContextState } from "./createContextState";

export const {
  Provider: LederProvider,
  useContextState: useLederContextState,
} = createContextState<Leder, { lederInfo: LederInfo; behovId: string }>(
  lederDefaults,
  (props: { lederInfo: LederInfo; behovId: string }) => ({
    lederInfo: props.lederInfo,
    behovId: props.behovId,
  }),
);
