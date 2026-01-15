import { type Leder, lederDefaults } from "@/schemas/nærmestelederFormSchema";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { createContextState } from "./createContextState";

export const {
  useContextState: useLederContextState,
  ViewControl: LederViewControl,
} = createContextState<Leder, { lederInfo: LederInfo; behovId: string }>(
  lederDefaults,
  (props: { lederInfo: LederInfo; behovId: string }) => ({
    lederInfo: props.lederInfo,
    behovId: props.behovId,
  }),
);
