import {
  type NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { createContextState } from "@/shared/state/createContextState";

export const {
  useContextState: useRegistreringContextState,
  ViewControl: RegistreringViewControlProvider,
} = createContextState<NarmesteLederInfo>(narmesteLederInfoDefaults);
