import { isLocalOrDemo } from "@/env-variables/envHelpers";

type Fn<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => TResult | Promise<TResult>;

type Implementation<TArgs extends unknown[], TResult> =
  | Fn<TArgs, TResult>
  | { fn: Fn<TArgs, TResult> };

type BackendModeImpls<TArgs extends unknown[], TResult> = {
  real: Implementation<TArgs, TResult>;
  fake: Implementation<TArgs, TResult>;
};

export const withBackendMode = <TArgs extends unknown[], TResult>(
  impls: BackendModeImpls<TArgs, TResult>,
): Fn<TArgs, TResult> => {
  const impl = isLocalOrDemo ? impls.fake : impls.real;
  if (typeof impl === "function") {
    return impl;
  }
  throw new Error("Provided implementation does not contain a valid function.");
};
