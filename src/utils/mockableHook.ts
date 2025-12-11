import { isLocalOrDemo } from "@/env-variables/envHelpers";

type HookFn<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult;

type MockableHookImpls<TArgs extends unknown[], TResult> = {
  real: HookFn<TArgs, TResult>;
  mock: HookFn<TArgs, TResult>;
};

/**
 * Creates a hook that switches between real and mock implementations
 * based on the environment (local/demo vs production).
 */
export const mockableHook = <TArgs extends unknown[], TResult>(
  impls: MockableHookImpls<TArgs, TResult>,
): HookFn<TArgs, TResult> => {
  return isLocalOrDemo ? impls.mock : impls.real;
};
