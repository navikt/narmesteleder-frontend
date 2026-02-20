import { Button } from "@navikt/ds-react";
import { useFormContext } from "@/shared/components/form/hooks/form-context";

export const SubmitButton = ({
  label,
  uiSelector,
}: {
  label: string;
  uiSelector?: string;
}) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          data-testid={uiSelector ? uiSelector : "submit-button"}
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
};
