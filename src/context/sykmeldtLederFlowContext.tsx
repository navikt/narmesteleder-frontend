import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { createFlowContext } from "./createFlowContext";

export const {
  Provider: SykmeldtLederProvider,
  useContextState: useSykmeldtLederContextState,
} = createFlowContext<NarmesteLederInfo>(narmesteLederInfoDefaults);
