const FNR_REGEX = /^\d{11}$/

export const formatFnr = (fnr: string): string => {
  const clean = fnr.trim()
  return FNR_REGEX.test(clean) ? `${clean.slice(0, 6)} ${clean.slice(6)}` : fnr
}
