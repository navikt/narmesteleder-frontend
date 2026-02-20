import { UiSelector } from "@/utils/uiSelectors";

export function InfoDescription() {
  return (
    <p data-testid={UiSelector.LederInfoDescription}>
      Personen som er oppgitt som nærmeste leder får tilgang til den sykmeldte
      ansatte og oppfølgingstjenestene på &quot;Dine sykmeldte&quot; på Nav sine
      innloggede sider.
    </p>
  );
}
