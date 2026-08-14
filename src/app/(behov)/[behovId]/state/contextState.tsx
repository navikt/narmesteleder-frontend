import { type Leder, lederDefaults } from "@/schemas/nærmestelederFormSchema";
import type { LederInfo } from "@/server/fetchData/fetchLederInfo";
import { createContextState } from "@/shared/state/createContextState";

type BehovContextProps = {
  lederInfo: LederInfo;
  behovId: string;
  returnTo?: string;
};

export const {
  useContextState: useBehovContextState,
  ViewControl: BehovViewControlProvider,
} = createContextState<Leder, BehovContextProps>(
  lederDefaults,
  (props: BehovContextProps) => ({
    lederInfo: props.lederInfo,
    behovId: props.behovId,
    returnTo: props.returnTo,
  }),
);
