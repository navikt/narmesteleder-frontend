import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { createContextState } from "./createContextState";

export const {
  useContextState: useSykmeldtAndLederContextState,
  ViewControl: SykmeldtAndLederViewControl,
} = createContextState<NarmesteLederInfo>(narmesteLederInfoDefaults);
