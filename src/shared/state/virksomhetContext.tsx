"use client";

import type { Organisasjon } from "@navikt/virksomhetsvelger";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

export interface ValgtVirksomhet {
  orgnummer: string;
  orgnavn: string;
}

interface VirksomhetContextState extends ValgtVirksomhet {
  organisasjoner: Organisasjon[];
  label: string;
  description?: string;
  isRequired: boolean;
  isSelectable: boolean;
  showSelector: boolean;
  hasVirksomhetContent: boolean;
  validationError?: string;
  setValidationError: (error?: string) => void;
  selectorInteractionCount: number;
  markSelectorInteracted: () => void;
  updateVirksomhet: (virksomhet: ValgtVirksomhet) => void;
}

const defaultVirksomhet: ValgtVirksomhet = {
  orgnummer: "",
  orgnavn: "",
};

function getFirstSelectableOrganisasjon(
  organisasjoner: Organisasjon[],
): Organisasjon | undefined {
  const [firstOrganisasjon] = organisasjoner;

  if (!firstOrganisasjon) {
    return undefined;
  }

  if (firstOrganisasjon.underenheter.length === 0) {
    return firstOrganisasjon;
  }

  return getFirstSelectableOrganisasjon(firstOrganisasjon.underenheter);
}

function getInitialVirksomhet({
  organisasjoner,
  initialVirksomhet,
  isSelectable,
}: {
  organisasjoner: Organisasjon[];
  initialVirksomhet: ValgtVirksomhet;
  isSelectable: boolean;
}): ValgtVirksomhet {
  if (
    initialVirksomhet.orgnummer ||
    initialVirksomhet.orgnavn ||
    !isSelectable
  ) {
    return initialVirksomhet;
  }

  const firstOrganisasjon = getFirstSelectableOrganisasjon(organisasjoner);

  if (!firstOrganisasjon) {
    return initialVirksomhet;
  }

  return {
    orgnummer: firstOrganisasjon.orgnr,
    orgnavn: firstOrganisasjon.navn,
  };
}

const VirksomhetContext = createContext<VirksomhetContextState | undefined>(
  undefined,
);

export function VirksomhetProvider({
  children,
  organisasjoner = [],
  initialVirksomhet = defaultVirksomhet,
  label = "Virksomhet",
  description = "Velg virksomheten du registrerer nærmeste leder for.",
  isRequired = false,
  isSelectable = false,
}: PropsWithChildren<{
  organisasjoner?: Organisasjon[];
  initialVirksomhet?: ValgtVirksomhet;
  label?: string;
  description?: string;
  isRequired?: boolean;
  isSelectable?: boolean;
}>) {
  const [virksomhet, setVirksomhet] = useState<ValgtVirksomhet>(() =>
    getInitialVirksomhet({
      organisasjoner,
      initialVirksomhet,
      isSelectable,
    }),
  );
  const [validationError, setValidationError] = useState<string | undefined>();
  const [selectorInteractionCount, setSelectorInteractionCount] = useState(0);
  const showSelector = isSelectable && organisasjoner.length > 0;
  const hasVirksomhetContent =
    showSelector || Boolean(virksomhet.orgnummer || virksomhet.orgnavn);

  const updateVirksomhet = (nextVirksomhet: ValgtVirksomhet) => {
    setVirksomhet(nextVirksomhet);
  };

  const markSelectorInteracted = () => {
    setSelectorInteractionCount((count) => count + 1);
  };

  return (
    <VirksomhetContext.Provider
      value={{
        orgnummer: virksomhet.orgnummer,
        orgnavn: virksomhet.orgnavn,
        organisasjoner,
        label,
        description,
        isRequired,
        isSelectable,
        showSelector,
        hasVirksomhetContent,
        validationError,
        setValidationError,
        selectorInteractionCount,
        markSelectorInteracted,
        updateVirksomhet,
      }}
    >
      {children}
    </VirksomhetContext.Provider>
  );
}

export function useVirksomhetContext() {
  const context = useContext(VirksomhetContext);

  if (!context) {
    throw new Error(
      "useVirksomhetContext must be used within VirksomhetProvider",
    );
  }

  return context;
}

export function useOptionalVirksomhetContext() {
  return useContext(VirksomhetContext);
}
