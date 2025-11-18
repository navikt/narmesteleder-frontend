import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { createContextState } from "./createContextState";

export const {
  Provider: SykmeldtLederProvider,
  useContextState: useSykmeldtLederContextState,
} = createContextState<NarmesteLederInfo>(narmesteLederInfoDefaults);
