import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { createContextState } from "./createContextState";

export const {
  Provider: SykmeldtAndLederProvider,
  useContextState: useSykmeldtAndLederContextState,
} = createContextState<NarmesteLederInfo>(narmesteLederInfoDefaults);
