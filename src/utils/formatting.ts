const FNR_REGEX = /^\d{11}$/;

export const formatFnr = (fnr: string): string => {
  const cleanedFnr = fnr.trim();
  return FNR_REGEX.test(cleanedFnr)
    ? `${cleanedFnr.slice(0, 6)} ${cleanedFnr.slice(6)}`
    : fnr;
};

export const joinNonEmpty = (
  fields: Array<string | null | undefined>,
  separator: string = " ",
): string => fields.filter(Boolean).join(separator);
