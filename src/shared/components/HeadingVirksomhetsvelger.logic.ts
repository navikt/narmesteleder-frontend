import type { Organisasjon } from "@navikt/virksomhetsvelger";

const joinAriaIds = (...ids: Array<string | null | undefined>) =>
  [...new Set(ids.filter(Boolean))].join(" ");

const EMPTY_VIRKSOMHET_ORGNR = "";
const EMPTY_VIRKSOMHET_LABEL = "Velg virksomhet";

export function shouldHandleFieldBlur(hasBlurredSinceFocus: boolean) {
  return !hasBlurredSinceFocus;
}

export function withEmptyVirksomhetsvalg(
  organisasjoner: Organisasjon[],
): Organisasjon[] {
  if (organisasjoner.length === 0) {
    return organisasjoner;
  }

  const hasEmptyOption = organisasjoner.some(
    (hovedenhet) =>
      hovedenhet.orgnr === EMPTY_VIRKSOMHET_ORGNR ||
      hovedenhet.underenheter.some(
        (underenhet) => underenhet.orgnr === EMPTY_VIRKSOMHET_ORGNR,
      ),
  );

  if (hasEmptyOption) {
    return organisasjoner;
  }

  const [firstOrganisasjon, ...remainingOrganisasjoner] = organisasjoner;

  return [
    {
      ...firstOrganisasjon,
      underenheter: [
        {
          orgnr: EMPTY_VIRKSOMHET_ORGNR,
          navn: EMPTY_VIRKSOMHET_LABEL,
          underenheter: [],
        },
        ...firstOrganisasjon.underenheter,
      ],
    },
    ...remainingOrganisasjoner,
  ];
}

export function getVirksomhetsvelgerOrganisasjoner({
  organisasjoner,
  orgnummer,
  hasInitializedSelection,
}: {
  organisasjoner: Organisasjon[];
  orgnummer: string;
  hasInitializedSelection: boolean;
}): Organisasjon[] {
  return !hasInitializedSelection && !orgnummer.trim()
    ? withEmptyVirksomhetsvalg(organisasjoner)
    : organisasjoner;
}

export function shouldClearVirksomhetFromSelectorButton({
  ariaHasPopup,
  ariaPressed,
  buttonText,
}: {
  ariaHasPopup: string | null;
  ariaPressed: string | null;
  buttonText: string;
}) {
  if (ariaHasPopup === "true") {
    return false;
  }

  if (ariaPressed === null) {
    return false;
  }

  const normalizedButtonText = buttonText.replace(/\s+/g, " ").trim();

  return (
    normalizedButtonText.startsWith(EMPTY_VIRKSOMHET_LABEL) &&
    normalizedButtonText.endsWith("Org.nr.")
  );
}

export function getHeadingVirksomhetsvelgerAriaLabel({
  orgnavn,
  orgnummer,
}: {
  orgnavn: string;
  orgnummer: string;
}) {
  if (!orgnummer.trim()) {
    return "Virksomhetsmeny. Ingen virksomhet valgt";
  }

  if (!orgnavn.trim()) {
    return `Virksomhetsmeny. Valgt virksomhet med virksomhetsnummer ${orgnummer}`;
  }

  return `Virksomhetsmeny. Valgt virksomhet er ${orgnavn} med virksomhetsnummer ${orgnummer}`;
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
