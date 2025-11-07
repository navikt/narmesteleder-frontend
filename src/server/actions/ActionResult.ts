type ActionResult<T> =
  | (T extends void | undefined
      ? { success: true }
      : { success: true; data: T })
  | { success: false; error: unknown };

export const withActionResult = async <T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> => {
  try {
    const value = await fn();
    return (
      value === undefined ? { success: true } : { success: true, data: value }
    ) as ActionResult<T>;
  } catch (error) {
    return { success: false, error } as ActionResult<T>;
  }
};
