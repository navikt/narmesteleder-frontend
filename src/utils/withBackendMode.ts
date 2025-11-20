import { isLocalOrDemo } from "@/env-variables/envHelpers";

type Fn<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

type BackendModeImpls<TArgs extends unknown[], TResult> = {
  real: Fn<TArgs, TResult>;
  fake: Fn<TArgs, TResult>;
};

export const withBackendMode = <TArgs extends unknown[], TResult>(
  impls: BackendModeImpls<TArgs, TResult>,
): Fn<TArgs, TResult> => {
  const impl = isLocalOrDemo ? impls.fake : impls.real;

  if (typeof impl === "function") {
    return async (...args: TArgs) => impl(...args);
  }
  throw new Error("Provided implementation does not contain a valid function.");
};
