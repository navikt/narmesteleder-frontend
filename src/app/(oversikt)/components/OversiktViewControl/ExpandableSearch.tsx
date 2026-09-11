"use client";

import { Button, HStack, TextField } from "@navikt/ds-react";
import { type ChangeEventHandler, useEffect, useRef, useState } from "react";
import { UiSelector } from "@/utils/uiSelectors";

interface ExpandableSearchProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  "data-testid": string;
}

export function ExpandableSearch({
  value,
  onChange,
  "data-testid": testId,
}: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <HStack>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setIsExpanded(true)}
          data-testid={UiSelector.ExpandableSearchTrigger}
        >
          Søk
        </Button>
      </HStack>
    );
  }

  return (
    <TextField
      ref={inputRef}
      label="Søk etter ansatt"
      description="Søk med navn eller fødselsnummer"
      size="medium"
      value={value}
      onChange={onChange}
      data-testid={testId}
      autoComplete="off"
    />
  );
}
