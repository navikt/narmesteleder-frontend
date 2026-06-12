export function getOrgnummerValidationError({
  submissionAttempts,
  isTouched,
  errorMessage,
}: {
  submissionAttempts: number;
  isTouched: boolean;
  errorMessage?: string;
}) {
  if (submissionAttempts <= 0 && !isTouched) {
    return undefined;
  }

  return errorMessage;
}

export function shouldMarkOrgnummerTouchedFromHeadingSelector({
  showSelector,
  selectorInteractionCount,
}: {
  showSelector: boolean;
  selectorInteractionCount: number;
}) {
  return showSelector && selectorInteractionCount > 0;
}
