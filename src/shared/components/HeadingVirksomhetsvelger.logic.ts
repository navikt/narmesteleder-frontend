const joinAriaIds = (...ids: Array<string | null | undefined>) =>
  [...new Set(ids.filter(Boolean))].join(" ");

export function shouldHandleFieldBlur(hasBlurredSinceFocus: boolean) {
  return !hasBlurredSinceFocus;
}

export function getHeadingVirksomhetsvelgerAriaDescribedBy({
  labelId,
  descriptionId,
  errorId,
  hasDescription,
  hasError,
}: {
  labelId: string;
  descriptionId: string;
  errorId: string;
  hasDescription: boolean;
  hasError: boolean;
}) {
  return joinAriaIds(
    labelId,
    hasDescription ? descriptionId : undefined,
    hasError ? errorId : undefined,
  );
}
