import { isLocalOrDemo } from "@/env-variables/envHelpers";

type Fn<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

type MockableImpls<TArgs extends unknown[], TResult> = {
  real: Fn<TArgs, TResult>;
  mock: Fn<TArgs, TResult>;
};

export const mockable = <TArgs extends unknown[], TResult>(
  impls: MockableImpls<TArgs, TResult>,
): Fn<TArgs, TResult> => {
  const impl = isLocalOrDemo ? impls.mock : impls.real;

  if (typeof impl === "function") {
    return async (...args: TArgs) => impl(...args);
  }
  throw new Error("Provided implementation does not contain a valid function.");
};
