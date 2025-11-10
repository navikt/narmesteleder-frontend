import { Button } from "@navikt/ds-react";
import { useFormContext } from "@/components/form/hooks/form-context";

export const BoundSubmitButton = ({ label }: { label: string }) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
};
