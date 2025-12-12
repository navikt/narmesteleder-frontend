import { Button } from "@navikt/ds-react";
import { useFormContext } from "@/components/form/hooks/form-context";

export const BoundSubmitButton = ({
  label,
  testId,
}: {
  label: string;
  testId?: string;
}) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          data-testid={testId ? testId : "submit-button"}
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
};
