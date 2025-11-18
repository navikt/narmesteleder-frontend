import {
  NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { createFlowContext } from "./createFlowContext";

export const {
  Provider: SykmeldtLederFlowProvider,
  useFlow: useSykmeldtLederFlow,
} = createFlowContext<NarmesteLederInfo>(narmesteLederInfoDefaults);
