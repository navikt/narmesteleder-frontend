import {
  type NarmesteLederInfo,
  narmesteLederInfoDefaults,
} from "@/schemas/nærmestelederFormSchema";
import { createContextState } from "@/shared/state/createContextState";

type RegistreringContextProps = {
  editId?: string;
  returnTo?: string;
};

export const {
  useContextState: useRegistreringContextState,
  ViewControl: RegistreringViewControlProvider,
} = createContextState<NarmesteLederInfo, RegistreringContextProps>(
  narmesteLederInfoDefaults,
  (props) => props,
);
